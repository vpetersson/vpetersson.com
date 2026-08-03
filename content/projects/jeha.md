---
title: Jeha
tagline: Two lines of config become a day of light.
summary: Just Enough Home Automation. A lighting daemon for Zigbee2MQTT that does circadian rhythms, motion and scenes, and deliberately nothing else. Point it at your Zigbee2MQTT instance and the lights look after themselves.
description: Jeha is an opinionated lighting daemon for Zigbee2MQTT written in Rust. Circadian rhythms, motion-activated lights, night mode and scenes, from a TOML file, with no database and no web UI.
keywords: home automation, zigbee2mqtt, circadian lighting, smart lighting, rust, mqtt, home assistant alternative, self-hosted
repo: vpetersson/jeha
image_url: vpetersson/jeha
license: GPL-3.0
language: Rust
blog_post:
  url: /2025/06/07/home-assistant-revamp/
  title: Why I built it
spec:
  - 3.87 MB image
  - 0 databases
  - no web UI
  - amd64, arm64, armv7, armv6
exchange:
  kind: config
  input_label: config.toml
  output_label: what Zigbee2MQTT receives
  # Payloads below were captured from a running instance against a local broker
  # with mosquitto_sub, not written by hand. Values reflect the moment of capture
  # (08:26 London), so the circadian numbers are mid-morning ones. The JSON is
  # pretty-printed for reading; on the wire each is a single line.
  rows:
    - id: circadian
      label: A room needs a name and a group. Circadian lighting follows from the defaults.
      config: |
        [rooms.kitchen]
        z2m_group = "Kitchen"
      topic: zigbee2mqtt/Kitchen/set
      payload: |-
        {
          "brightness": 246,
          "color_temp": 256,
          "transition": 30
        }
    - id: motion
      label: Add a motion sensor and the lights come on to the right colour, then go off again.
      config: |
        [rooms.hallway]
        z2m_group = "Hallway"
        motion_sensor = "0x00158d0004abcdef"
        motion_timeout_secs = 120
      topic: zigbee2mqtt/Hallway/set
      payload: |-
        {
          "brightness": 246,
          "color_temp": 255,
          "state": "ON",
          "transition": 1
        }
features:
  - title: Lighting, and nothing else
    body: Jeha is deliberately not a general-purpose platform. It does lights extremely well and leaves climate, media and blinds to Home Assistant. Run it alongside, not instead.
  - title: Defaults you can live with
    body: Give a room a name and a Zigbee2MQTT group and you get a circadian curve tuned for a home. Most rooms never need more than that.
  - title: Addresses, not names
    body: Config references IEEE hardware addresses, and friendly names resolve at runtime. Renaming a device in Zigbee2MQTT cannot quietly break an automation.
  - title: No database
    body: All state derives from the config file, Zigbee2MQTT retained messages and the current time. Restart whenever you like and it converges in seconds.
  - title: It leaves lights that are off alone
    body: Circadian only pushes to rooms that are already on, so nothing switches itself on at 3am because a curve moved.
  - title: It notices when you take over
    body: Activate a scene or reach for a remote and jeha detects the change and pauses circadian, rather than fighting you for control of the bulb.
---

## Run it

`jeha init` connects to Zigbee2MQTT, discovers your groups and devices, and writes a
starter config you can edit.

```bash
docker run --rm -v $(pwd):/out vpetersson/jeha:latest \
  init --mqtt <mqtt-host>:1883 --output /out/config.toml

docker run -d --name jeha --restart unless-stopped \
  -v $(pwd)/config.toml:/config.toml \
  vpetersson/jeha:latest
```

New Zigbee2MQTT groups with lights in them get appended to the config automatically.
Restart or send `SIGHUP` to pick them up. A bad config on reload is rejected and the old
one keeps running.

## The curve

Circadian is a cosine interpolation between three points: wake, midday and sleep. The
defaults run 06:00 to 23:00, from 2700K up to 4000K and back down to 2200K. Set `curve`
to `linear` if you would rather it ramp evenly. Transitions run over 30 seconds, so you
never catch it moving.

```toml
[circadian.defaults]
wake_time = "06:00"
sleep_time = "23:00"
start_temp_k = 2700
peak_temp_k = 4000
end_temp_k = 2200
curve = "cosine"
transition_secs = 30
```

Override any of it per room, or set `circadian_enabled = false` for somewhere it makes
no sense, like a porch.

## Schedules

Night mode, motion gating and custom automations all share one schedule predicate. Time
ranges cross midnight, and day and month filters combine with them.

```toml
[rooms.bedroom.night_mode]
schedule = { after = "22:00", before = "06:30" }

[rooms.office]
z2m_group = "Office"
motion_sensor = "0x00158d000AAAAAAA"
motion_schedule = { after = "08:00", before = "17:00", days = ["mon", "tue", "wed", "thu", "fri"] }
```

## An API instead of a dashboard

There is no web UI. Jeha exposes a REST API on port 8420, which is the thing you point a
script, a shortcut or an assistant at. Asking a room for the `relax` scene returns what
it did and why:

```json
{
  "room": "kitchen",
  "scene": "relax",
  "brightness": 150,
  "color_temp_k": 2700,
  "description": "kitchen: relax - Relaxed - dimmer, warm white. Circadian paused. Use resume_circadian to go back to automatic.",
  "status": "ok"
}
```

Rooms, circadian pause and resume, snooze, night mode, Zigbee2MQTT scene recall and a
system health endpoint are all there.

## Remotes

Zigbee2MQTT remote actions map onto built-in behaviour with no configuration: add the
remote's address to a room's `remotes` list and toggle, dim, hold-to-dim and night mode
all work. Tested against IKEA STYRBAR, TRADFRI and RODRET, Philips Hue dimmers and the
Smart button, Aqara Mini, Sonoff SNZB-01 and Tuya TS004F.
