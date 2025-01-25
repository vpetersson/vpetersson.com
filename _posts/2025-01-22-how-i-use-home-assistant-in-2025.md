---
layout: post
title: How I Use Home Assistant in 2025
date: '2025-01-22T01:00:00+01:00'
tags:
- home-assistant
- home-automation
- smart-home
- iot
---

I've been using Home Assistant for about seven years now, starting back when I was living in a small apartment. At the time, my setup was modest: I used the **IKEA Smart Hub** (when it first launched) to tie together all my apartment's lights. As I got more comfortable with automations, I also began building [custom hardware like temperature and humidity sensors](/2019/11/16/home-assistant-and-esphome.html).

However, once I started adding more complexity (more devices, more automations), I realized that running Home Assistant on a Raspberry Pi just wasn't viable anymore. This was before Home Assistant offered their own hardware (which I haven't tried, so I can't say much about it). But for me, the main issue was the database. By default, Home Assistant uses SQLite, and when you have a ton of sensor data flowing in, SQLite can start choking.

My solution was to move everything to a VM on my home server. I also migrated Home Assistant's main database to MySQL, and for longer-term metrics and historical data, I set up an InfluxDB server. (I've documented the details of my [home server build in another blog post](/2024/05/04/home-server-journey.html).)

## Scaling Up in a New House

When I moved into a house, my Home Assistant installation grew significantly: more rooms, more lights, and more devices overall. Right now, I have over 100 devices connected to Home Assistant, including a large number of smart lights (all IKEA), plus an assortment of other smart devices. Practically every bulb in my home is now integrated into Home Assistant.

### Adaptive Lighting: Moving Beyond Flux

One of the crucial features for me is **Adaptive Lighting**. Initially, I used Flux (an older solution for synchronizing lights with the time of day - see [my guide on Home Assistant, Flux and sensors](/2020/05/25/homeassistant-ikea-tradfri-flux-sensors.html)), but I've since migrated to the new Adaptive Lighting integration available through HACS (Home Assistant Community Store). This newer system is much more sophisticated, offering better control over color temperature and brightness throughout the day.

Managing this setup comes with two main challenges. First, neither Flux nor Adaptive Lighting can target light groups. Instead, you need to explicitly list every single light entity in your configuration. This becomes particularly tedious when you have dozens of lights that you want to manage together. It would have been much more convenient to just point the integration to a group and have it handle all the lights within that group automatically.

The second challenge is that even though all my bulbs are from IKEA, they don't have all the same features. This means I need separate configurations for each category to get Adaptive Lighting working correctly. But the effort is worth it: circadian rhythms are important to me, and I really want that smooth, automatic shift in color temperature from warm yellows in the morning and evenings to cooler whites and blues during midday.

## Using Cursor to Speed Up Configuration

One big leap for me this year has been leveraging [Cursor](https://www.cursor.com), an AI coding assistant, to handle the more tedious parts of Home Assistant's YAML configurations. I'll admit, I've never had the time to master every detail of Home Assistant's DSL or its configuration files.

### Writing a Custom Parser

The first major task I tackled with Cursor was writing a custom script to parse all my lights, figure out exactly what kind of bulb each one is, and spit out debugging information. This is the foundation of building the correct adaptive lighting setup. Once the script categorizes the bulbs, I can then create or update the YAML configuration for each bulb type.

Here's the script I use to analyze my Home Assistant lights. It connects to the Home Assistant API, categorizes all lights by their capabilities, and provides detailed debugging information about their current state and supported features:

```python
import requests
import json
import os
from datetime import datetime

TOKEN = os.getenv("HA_TOKEN")  # Set this to your long-lived access token (Bearer: <token>)

# Function to get entity state
def get_entity_state(entity_id):
    url = "http://localhost:8123/api/states/" + entity_id
    headers = {
        "Authorization": TOKEN,
        "content-type": "application/json",
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error getting state for {entity_id}: {response.status_code}")
        return None

def get_all_lights():
    """Get all light entities from Home Assistant."""
    url = "http://localhost:8123/api/states"
    headers = {
        "Authorization": TOKEN,
        "content-type": "application/json",
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        entities = response.json()
        lights = []
        for entity in entities:
            entity_id = entity['entity_id']
            if entity_id.startswith('light.'):
                lights.append(entity_id)
        return sorted(lights)
    else:
        print(f"Error getting entities: {response.status_code}")
        return []

def get_adaptive_switch_state(name):
    switch_id = f"switch.adaptive_lighting_{name.lower()}"
    state = get_entity_state(switch_id)
    if state:
        print(f"Adaptive switch {switch_id} full state: {json.dumps(state, indent=2)}")
    return state

def check_light_capabilities(light_attrs, group_name, light_id, adaptive_config):
    """Check if light capabilities match adaptive lighting settings."""
    warnings = []

    # Check color temperature support
    if ('color_temp_kelvin' in adaptive_config and
        'supported_color_modes' in light_attrs and
        'color_temp' not in light_attrs['supported_color_modes']):
        warnings.append(f"WARNING: {light_id} in {group_name} group doesn't support color temperature, "
                      f"but adaptive lighting is trying to set it. Supported modes: {light_attrs['supported_color_modes']}")

    # Check brightness support
    if ('brightness_pct' in adaptive_config and
        'supported_color_modes' in light_attrs and
        'brightness' not in light_attrs['supported_color_modes']):
        warnings.append(f"WARNING: {light_id} in {group_name} group doesn't support brightness, "
                      f"but adaptive lighting is trying to set it. Supported modes: {light_attrs['supported_color_modes']}")

    return warnings

def analyze_current_state(lights, group_name):
    print(f"\n=== {group_name} Current State ===")
    print(f"Analyzing at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Get adaptive lighting switch state
    switch_state = get_adaptive_switch_state(group_name)
    adaptive_config = {}
    if switch_state:
        print(f"Adaptive Lighting Switch: {switch_state['state']}")
        print(f"Last changed: {switch_state.get('last_changed', 'unknown')}")
        print(f"Attributes: {json.dumps(switch_state.get('attributes', {}), indent=2)}")
        adaptive_config = switch_state.get('attributes', {})
    else:
        print("Adaptive Lighting Switch: Not found")

    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    print(f"Current Time: {current_time}")

    # Track brightness statistics
    brightness_stats = {
        'min': float('inf'),
        'max': float('-inf'),
        'total': 0,
        'count': 0
    }

    # Group lights by capabilities
    light_types = {}
    capability_warnings = []

    for light in lights:
        state = get_entity_state(light)
        if not state:
            print(f"{light}: Not found or offline")
            continue

        attrs = state['attributes']
        status = []
        capabilities = []

        # Check capabilities against adaptive lighting settings
        if adaptive_config:
            warnings = check_light_capabilities(attrs, group_name, light, adaptive_config)
            capability_warnings.extend(warnings)

        # Basic state
        if state['state'] == 'on':
            if 'brightness' in attrs:
                brightness_pct = round((attrs['brightness'] / 255) * 100)
                status.append(f"brightness: {brightness_pct}%")
                # Update brightness statistics
                brightness_stats['min'] = min(brightness_stats['min'], brightness_pct)
                brightness_stats['max'] = max(brightness_stats['max'], brightness_pct)
                brightness_stats['total'] += brightness_pct
                brightness_stats['count'] += 1

            if 'color_temp_kelvin' in attrs:
                status.append(f"temp: {attrs['color_temp_kelvin']}K")
            elif 'color_temp' in attrs:
                status.append(f"mired: {attrs['color_temp']}")

            print(f"{light}: ON - {', '.join(status)}")
        else:
            print(f"{light}: OFF")

        # Detailed capabilities
        if 'supported_color_modes' in attrs:
            capabilities.append(f"modes:{attrs['supported_color_modes']}")
        if 'min_color_temp_kelvin' in attrs and 'max_color_temp_kelvin' in attrs:
            capabilities.append(f"temp:{attrs['min_color_temp_kelvin']}-{attrs['max_color_temp_kelvin']}")
        if 'supported_features' in attrs:
            capabilities.append(f"features:{attrs['supported_features']}")

        # Group by capabilities
        cap_key = ','.join(sorted(capabilities))
        if cap_key not in light_types:
            light_types[cap_key] = []
        light_types[cap_key].append(light)

    # Print capability warnings
    if capability_warnings:
        print("\n=== Capability Warnings ===")
        for warning in capability_warnings:
            print(warning)

    # Print brightness statistics
    if brightness_stats['count'] > 0:
        print(f"\n=== {group_name} Brightness Statistics ===")
        print(f"Minimum brightness: {brightness_stats['min']}%")
        print(f"Maximum brightness: {brightness_stats['max']}%")
        print(f"Average brightness: {brightness_stats['total'] / brightness_stats['count']:.1f}%")
        print(f"Number of lights on: {brightness_stats['count']}")

    # Print summary of light types
    print(f"\n=== {group_name} Light Types ===")
    for cap_key, lights in light_types.items():
        print(f"\nCapabilities: {cap_key}")
        print("Lights:")
        for light in lights:
            print(f"  - {light}")

def group_lights_by_capability(lights):
    """Group lights by their capabilities."""
    color_temp_lights = []
    brightness_lights = []
    other_lights = []

    for light in lights:
        state = get_entity_state(light)
        if not state:
            continue

        attrs = state['attributes']
        if 'supported_color_modes' in attrs:
            if 'color_temp' in attrs['supported_color_modes']:
                color_temp_lights.append(light)
            elif 'brightness' in attrs['supported_color_modes']:
                brightness_lights.append(light)
            else:
                other_lights.append(light)
        else:
            other_lights.append(light)

    return {
        'Color Temperature': color_temp_lights,
        'Brightness Only': brightness_lights,
        'Other': other_lights
    }

# Main execution
if __name__ == "__main__":
    all_lights = get_all_lights()
    print("\n=== All Lights Analysis ===")
    print(f"Found {len(all_lights)} lights in total")

    # Group lights by capability
    grouped_lights = group_lights_by_capability(all_lights)

    # Analyze each capability group
    for group_name, lights in grouped_lights.items():
        if lights:  # Only analyze groups that have lights
            analyze_current_state(lights, group_name)
```

1. **Run the custom parsing script** on my Home Assistant setup to produce a detailed list of bulbs and their capabilities.
2. **Feed the output** into Cursor (in "agent mode" or similar), along with my old configuration.
3. **Have Cursor generate** the updated YAML for the new Adaptive Lighting system.

It's been a huge time-saver. Sure, I still do some manual debugging, but I also use Cursor to assist with the troubleshooting. For instance, if something breaks in Home Assistant, I feed the logs into Cursor and ask it to help me fix the error. It's surprisingly effective.

## IKEA Advice

After extensive testing, I've optimized my adaptive lighting configurations for different IKEA bulb types. Here are my recommended settings that provide smooth transitions while maintaining good visibility throughout the day.

### Dimmable white spectrum

For IKEA's *LED bulb GU10 345 lumen, smart/wireless dimmable white spectrum* bulbs.

```yaml
  - name: adapt_brightness_standard_color_temp
    lights:
      - light.light_1
      - light.light_2
    min_brightness: 50
    max_brightness: 100
    min_color_temp: 2202
    max_color_temp: 4000
    sleep_brightness: 1
    sleep_color_temp: 2202
    transition: 45
    interval: 90
    initial_transition: 1
    prefer_rgb_color: false
```

### Dimmable color and white spectrum

For the *LED bulb E27 806 lumen, wireless dimmable color and white spectrum/globe opal white* bulbs.

```yaml
  - name: adapt_brightness_extended_color_temp
    lights:
      - light.light_3
      - light.light_4
    min_brightness: 70
    max_brightness: 100
    min_color_temp: 2000
    max_color_temp: 6535
    sleep_brightness: 1
    sleep_color_temp: 2000
    transition: 45
    interval: 90
    initial_transition: 1
    prefer_rgb_color: false
```

### Dimmable warm white

For the basic *LED bulb GU10 345 lumen, smart/wireless dimmable warm white* bulbs.

```yaml
  - name: adapt_brightness_brightness_only
    lights:
      - light.light_5
      - light.light_6
    min_brightness: 50
    max_brightness: 100
    sleep_brightness: 1
    transition: 45
    interval: 90
    initial_transition: 1
```

## Next Steps: Smart TRVs

Now that the lighting is running smoothly, my next big smart home project is upgrading all my radiators with Zigbee-based smart TRVs (thermostatic radiator valves). The goal is to have each room in my home maintain an optimal temperature by reading from the central Nest thermostat. In older British homes like mine, temperature control isn't very granular, so having each radiator adjust itself is a major comfort and efficiency boost.

I've already purchased [these TRVs](https://s.click.aliexpress.com/e/_EzwaYAM) but haven't had time to configure them yet. My plan is:

1. **Pair the TRVs** to my Zigbee network.
2. **Pull temperature data** from my Nest thermostat (the main sensor).
3. **Set up automations** in Home Assistant so that each room's radiator valve opens or closes based on its own target temperature.

I'm hoping this will help solve the typical British house problem: some rooms end up too warm, while others are never warm enough. With per-room heating control, it should be far more balanced and efficient.

## Conclusion (So Far)

That's where my Home Assistant journey sits at the moment. I'm thrilled with how the adaptive lighting is working, especially now that I've harnessed an AI coding assistant to manage the complexity of my YAML files. The next challenge, smart radiator valves, will hopefully bring my home's temperature control on par with my lighting automation.
