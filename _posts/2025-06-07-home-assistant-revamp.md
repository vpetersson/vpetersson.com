---
layout: post
title: "From Gateway to Dongle: Lessons from My Home Assistant Overhaul"
tags: [homeassisstant, iot]

---

I’ve previously written about my experiences with Home Assistant [here]({{ site.url }}/2020/05/25/homeassistant-ikea-tradfri-flux-sensors.html) and [here]({{ site.url }}/2025/01/22/how-i-use-home-assistant-in-2025.html). This article follows up on those posts and describes my current setup.

Today, my stack includes Home Assistant (HA), Zigbee2MQTT (Z2M) and the Mosquitto MQTT server, all running in Docker with Docker Compose on a VM.

Here are some things I've learned, which would might save others time and effort.

---

## The best UI is no UI

I wrote this in my first HA article years ago, but it still holds true: ideally, you never touch a button or, worse, the HA app. I only reach for a light switch or HA when something unusual happens. Everything else is driven by motion sensors or time-based automations.

## Never cut power to Zigbee lights

Zigbee is a mesh network. Turning off one or more nodes at the wall disrupts the mesh, and it can take a while to rebuild. Use Zigbee-based wall switches instead, especially if you live with other people.

## Use groups, not individual devices

If you run a Zigbee adapter, group your lights in Z2M. This cuts network chatter and speeds up actions.

## Push actions as far down the stack as possible

If something can be handled in Z2M it will be faster and more reliable than doing it in HA. Latency matters: a delay of a few hundred milliseconds on a motion sensor is the difference between a seamless experience and wondering if something is broken. Sometimes you must move logic up to HA (for example, different actions by time of day or day of week), but keep simple, binary triggers in Z2M whenever you can.

## Version-control your configuration

If you’re “vibe-coding” your config, put the entire thing under `git`. Gen-AI tools love to invent syntax and spit out invalid YAML. I added two Git hooks to guard against this:

1. Lint the YAML to catch obvious errors.
2. Validate the config with HA to catch subtler ones.

```bash
#!/bin/bash

# Get list of staged YAML files
STAGED_YAML_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.ya?ml$')

if [ -n "$STAGED_YAML_FILES" ]; then
    echo "Running yamllint on staged YAML files..."

    # Run yamllint on each staged YAML file
    for file in $STAGED_YAML_FILES; do
        # Let's try to autofix first
        docker run -v "$(pwd):/project" ghcr.io/google/yamlfmt:latest "$file"

        if ! yamllint "$file"; then
            echo "❌ yamllint failed on $file"
            exit 1
        fi
    done

    echo "✅ All YAML files passed yamllint"
fi

# Run Home Assistant configuration check
docker exec home-assistant hass --script check_config -c /config

# If either check fails, prevent the commit
if [ $? -ne 0 ]; then
    echo "Pre-commit checks failed. Please fix the issues before committing."
    exit 1
fi
```

If both hooks pass, most easy mistakes are eliminated.

I still use the UI for some automations and checks – it’s not either vibe-coding or the UI; there’s room for both.

## Choose your path wisely

If you want full control and don’t mind a steep learning curve, skip gateways and use a Zigbee dongle. You’ll gain flexibility at the cost of complexity; even a simple motion-controlled light takes real effort.

The easy route is a gateway such as IKEA’s. It works out of the box and is user-friendly, but locks you to one vendor. If you don’t have grandiose plans, this path serves well. I switched only because adaptive lighting kept nagging me and I wanted smart radiator controllers, but the migration was anything but painless.

If you go down the HA+Z2A appaorach, here's my `docker-compose.yml` file that I use to setup the stack:

```yaml
services:
  homeassistant:
    container_name: home-assistant
    image: homeassistant/home-assistant:stable
    pull_policy: always
    network_mode: host
    volumes:
      - /usr/local/homeassistant:/config
      - /etc/localtime:/etc/localtime:ro
    restart: always
    logging:
      driver: journald

  zigbee2mqtt:
    container_name: zigbee2mqtt
    image: koenkk/zigbee2mqtt
    pull_policy: always
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:8080"
    devices:
      - /dev/serial/by-id/[...]:/dev/ttyACM0
    volumes:
      - /usr/local/zigbee2mqtt:/app/data
      - /run/udev:/run/udev:ro
      - /etc/localtime:/etc/localtime:ro
    environment:
      - TZ=Europe/London

  mqtt:
    image: eclipse-mosquitto:2
    container_name: mqtt
    restart: unless-stopped
    pull_policy: always
    volumes:
      - /usr/local/mosquitto:/mosquitto
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "127.0.0.1:1883:1883"
      - "127.0.0.1:9001:9001"
    command: "mosquitto -c /mosquitto-no-auth.conf"
```

This is then exposed using Nginx and a [Tailscale issued TLS certificate]({{ site.url }}/2022/12/23/securing-services-with-tailscale.html).

## Adaptive lighting is the killer feature

HA can do a lot, yet adaptive lighting is the biggest quality-of-life boost for me. Every light in my house is Zigbee, most are on motion sensors or timers, and all adjust color and brightness automatically. If you get up at 3 a.m., the bathroom lights come on in “night mode” (triggerd by an automation) – minimum brightness, warm tint. Going back to static bulbs or flipping switches dozens of times a day would be a major step backward.

---

That’s my current setup and the hard-won lessons behind it. I hope they save you a few headaches on your own Home Assistant journey.
