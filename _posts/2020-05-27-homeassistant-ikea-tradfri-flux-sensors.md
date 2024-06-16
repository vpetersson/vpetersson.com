---
layout: post
title: Achieving success with Home Assistant, Flux and sensors
date: '2020-05-25T13:00:00+01:00'
tags:
- home-assistant
- home-automation
- virtualization
- ikea-tradfri
- iot
- sensors
---
My philosophy for home automation from the start has been that **the best UI is no UI**, meaning that I just want things to work automagically. I don’t want to fiddle buttons or software on a day-to-day basis. Sensors and automations should do most of the work.

In addition to automation, I wanted [f.lux](https://justgetflux.com/)/Flux/Night Shift for my lights, meaning that the lights should follow my [circadian rhythm](https://nigms.nih.gov/education/fact-sheets/Pages/Circadian-Rhythms.aspx) and change color over the course of the day to mimic the sun.

As often happens with tech projects, this turned out to be a lot more complicated.

![](/assets/home-assisant-overview.png)
*Screenshot of one of the views in Home Assistant*

I must now admit that I’ve spent/wasted (depending on how you look at it) countless hours getting things to a state where I’m happy. Hopefully this article will save you some time if you’re looking to accomplish the same.

At the end of this article, you should be able to:
* Not screw up your [Home Assistant](https://www.home-assistant.io/) setup like I did
* Configure Home Assistant to work with your IKEA Tradfri lights
* Setup Flux with IKEA Tradfri lights
* Monitor air quality in all your rooms and be able to take actions on this (e.g. turn on a fan when the CO2/humidity/temperature level gets above/below a threshold)
* Integrate Home Assistant with Unifi to determine presence based on WiFi connection (e.g. when my phone disconnects from the WiFi I’m considered away)

## Picking your home automation software
If you’re just diving into home automation, you will likely be somewhat overwhelmed with the amount of options out there. In addition to all hardware vendor's solutions (e.g. IKEA, Philips Hue etc), Apple also threw themselves into the game with their Home.app. My advice is that you should try to keep things simple, and stay with any of these if you can, as it will save you countless of hours.

Unfortunately, neither the IKEA app, nor Apple’s Home.app provided me what I wanted, so I had to keep looking. What I landed on was Home Assistant (HA), which has arguably become the most popular (open source) home automation platform.

I must admit that I have a love-hate relationship with HA. While it is a very powerful platform that integrates with almost anything under the sun, it suffers from the same problem as many open source projects do:
* (Sometimes) outdated documentation
* Poor quality control

I’m not blaming the developers for this, as it is a complex product that is fast moving. It is likely very hard to test all integrations (as it connects to hardware after all). Without going into a rant about my issues, it’s suffice to say that my home setup has been broken countless times by updates (either because of bugs or non-backward compatible changes), and that I’m very reluctant to update the system these days.

## Setting up Home Assistant
Judging by the forums, the most popular way to run HA is using a Raspberry Pi. This is probably fine if you have a very simple setup (in which case, IKEA/Hue/Apple might be easier). However, if you’re aspiring to setup something similar to what I will be describing here, I strongly discourage using a Raspberry Pi. While the Pi 4 with a sufficient amount of RAM might provide you with sufficient amount of resources, the storage will likely be both too slow and fragile (i.e.  the SD card is likely to wear out quickly).  In addition, the way I’ve setup HA requires that you have access to the host directly to launch additional Docker containers, which is something the Raspberry Pi version of HA doesn’t allow for. In theory, you might run multiple Raspberry Pis instead, but I decided to simply throw it all into a single VM on an x86 server instead.

In summary, I strongly recommend that you setup HA in a VM rather than a Raspberry Pi.  When we’re done, we will be running tools like InfluxDB and MySQL/MariaDB side-by-side with HA, which is likely to bring a Raspberry Pi to its knees (in particular from an I/O perspective).

Launching HA on a VM with Docker installed is very straight forward. Here’s the launch script that I’m using:

```
#!/bin/bash

VERSION=stable

echo "Upgrading from: $(docker inspect home-assistant | jq '.[0].Image')"
docker pull homeassistant/home-assistant:${VERSION}
docker kill home-assistant
docker rm home-assistant
docker run \
    --init -d \
    --restart always \
    --name="home-assistant" \
    -v /usr/local/homeassistant:/config \
    -v /etc/localtime:/etc/localtime:ro \
    --net=host \
    homeassistant/home-assistant:${VERSION}

# These steps may no longer be needed
docker exec home-assistant pip3 install --no-cache-dir -q --upgrade pip
docker exec home-assistant pip3 install --no-cache-dir -q -U pymysql

echo "Now running: $(docker inspect home-assistant | jq '.[0].Image')"
docker system prune -f
```

You can find more information on how to run HA with Docker [here](https://www.home-assistant.io/docs/installation/docker/).

## Configure Home Assistant to store events in MySQL/MariaDB
One of the issues I ran into relatively early was the limitation of the built-in database. By default, HA is using an SQLite database. This is perfectly fine if you have a simple setup. However, as we start pushing more and more events to HA, such as sensor data and network device data (from Unifi in my case), what you will notice is that at some point is that the HA UI will grind to a halt and become extremely slow. For me, the Logbook and History tabs would not even load. After taking a closer look, I discovered that my SQLite database was several hundred megabytes, which explained the timeout.

Fortunately, HA does support MySQL/MariaDB out-of-the box. All you need to do is to setup a MySQL/MariaDB database and reconfigure the [recorder](https://www.home-assistant.io/integrations/recorder/) to instead use the database. This had a tremendous effect on performance.

My recommendation is that you start with MySQL/MariaDB right away, as you will have to jump through a number of hoops to migrate your SQLite data into the new database later. It’s possible (I did it), but just not a straight forward process.

## Configure Home Assistant to send metrics to InfluxDB
While we’re on the topic of databases, I’ve also configured my HA to send metric data to [InfluxDB](https://www.home-assistant.io/integrations/influxdb/). Using this configuration, I’m able to visualize HA data (such as temperature) in Grafana (which can retrieve data from InfluxDB).

![](/assets/grafana-home-assistant.png)
*Example of Home Assistant sensor data being rendered in Grafana (via InfluxDB)*


## Notes on IKEA lights
While there are countless "smart bulbs" out there, I settled on the IKEA Tradfri, largely because they were cost effective (a fraction of the cost of Philips Hue). When you setup something like Flux, it’s important to know which lights you have. For instance, the setup for Philips Hue uses a different `mode`.

What’s important to point out is that IKEA lights come in two different versions (as far as I know):
* One that only provides shades of warm white (e.g. [this one](https://www.ikea.com/gb/en/p/tradfri-led-bulb-gu10-400-lumen-wireless-dimmable-warm-white-60420041/))
* One that provides shades of white *and* yellow (e.g. [this one](https://www.ikea.com/gb/en/p/tradfri-led-bulb-gu10-400-lumen-wireless-dimmable-white-spectrum-90408603/))

It’s important that you know which one(s) you are using, as you cannot mix them in the same Flux group. I unfortunately bought both types, but in retrospect, I should have stuck to a single type. It is also worth noting that neither of these are RGB (unlike say the Philips Hue), which is why they are a lot cheaper. Personally, I don’t care for RGB lights, so this was fine by me.

It’s also worth saying that you will need the IKEA Gateway for this to work.

As a side-note, I must stress that under no circumstances do you want to re-scan the QR code of your gateway after the setup, even if the app will prompt for it. By doing so, you reset the IDs of the lights, and you will need to do the mapping again.

## Setting up Flux with IKEA lights
I’m not going to waste cycles in this article on how to setup the IKEA lights in HA, as that’s a very straight forward process. Instead, let’s focus on getting the circadian rhythm configuration to work.

As noted in the previous section, before you begin, you need to know what lights you have. If you’re having a combination of both, do make sure you know which light is which. It will break the Flux if you include the wrong type.

[Flux](https://www.home-assistant.io/integrations/flux/) is built directly into HA. All we need to do is to configure and enable it. While that sounds easy, I have banged my head against the wall for countless hours trying to get it to work, and hopefully this will save you the effort (because I used the wrong `mode` and tried to group all my lights together).

Since I have both types of IKEA lights, I need to have two distinct Flux configurations.

For the yellow+white spectrum lights, the configuration looks like this:

```
switch:
  - platform: flux
    lights:
      - light.tradfri_bulb_10
        [...]
    name: Flux Mired
    start_time: '8:00'
    stop_time: '22:00'
    mode: mired
```

For the yellow-only lights, the configuration looks like this:

```
  - platform: flux
    lights:
      - light.tradfri_bulb
      [...]
    name: Flux XY
    start_time: '8:00'
    stop_time: '22:00'
    brightness: 200
    mode: xy
```

(Note that both of these goes into the same `switch` block above)

## Monitoring air quality
As someone that [works from home](/remote-work/), I’m in control of my work environment. I want to ensure that it is optimized both for ergonomics and for health at large. One thing that I’ve been curious about for some time has been the impact of air quality. Many moons ago, I purchased a [Foobot](https://foobot.io/) to get some insight into this. While it did the job, and it does indeed integrate with HA, it was a bit cost prohibitive to put one of these in every room (not to mention that it is rather large). To solve this problem, I decided to [build my own](https://blog.viktorpetersson.com/2019/11/16/home-assistant-and-esphome.html) that is both smaller and cheaper.

(Since publishing the blog post, I’ve received a number of requests from people who wanted the same. As many users just wanted this off-the-shelf and not solder together the components, I’ve teamed up with the fine folks at Pi Supply to manufacture the sensor. You can pre-order from [here](https://uk.pi-supply.com/products/iot-home-air-quality-sensor-for-home-assistant).)

With these sensors live, I’m able to do things like:
* Visualize the historical temperature/humidity/VOC/CO2 values
* Automate the fan in my office, such that it turns on/off automatically when either the temperature or CO2 level reaches a certain threshold

![](/assets/home-assistant-history.png)

Again, make sure you’ve configured the MySQL/MariaDB recorder before you start adding sensors, as your HA will quickly become sluggish as the data builds up (in particular if you’re trying to get a histogram or similar).


## Setting up Unifi with Home Assistant
One neat thing about HA is that it integrates with the Unifi Controller, such that you can configure actions ([Presence Detection](https://www.home-assistant.io/getting-started/presence-detection/)) based on who’s connected to the WiFi, which in turn maps to HA's own "Persons" feature. There are other ways to accomplish this, including Bluetooth and HA's mobile app, but given that I’m already using Unifi hardware, this was the obvious choice for me.

Setting this up was straight forward, and the details can be found [here](https://www.home-assistant.io/integrations/unifi/). I must however note that I have had this integration break multiple times due to bugs.

The reason why I wanted to setup Presence Detection was such that I can trigger automation when arriving or leaving the home.

For instance, when I leave, the following things happen:
* All lights turn off
* The music is paused on my Sonos
* I turn off all outlets with smart plugs

Similarly, when I arrive home, the following thing happens:
* Flux gets re-enabled (disabled when away)
* All lights turn on
* The outlets are turn on again

## Sonos integration
Finally, I got speakers in basically every room, as I love being able to have some low background music on all day. HA integrates nicely with Sonos, and there’s not much to speak about it as far as the setup goes. If your Sonos is on the same VLAN as your HA node, it will be detected automatically when you enable the [Sonos integration](https://www.home-assistant.io/integrations/sonos/).

With the integration enabled, you will display what’s being played in the UI, as well as automate actions (such as pausing music when you leave your house).

## Conclusion
HA is a powerful platform. While it will likely take you some time to set it up to your likings, I have run into few limitations. There is an [active community](https://community.home-assistant.io/) that is quick to answer questions if you run into issues.

After about 1.5 years with HA, I am now at a point where I almost have no complaints. It took me some time to get here, but these days I only interact with HA a few times a week. The rest is handled by automation, which is exactly what I was looking for.
