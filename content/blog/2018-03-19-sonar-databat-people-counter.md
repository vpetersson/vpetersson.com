---
slug: sonar-databat-people-counter
title: Sonar - A Raspberry Pi based wireless people counter
date: '2018-03-19T13:00:00+01:00'
tags:
- raspberry-pi
- linux
- analytics
- ble
---

Over the last year, I've been hacking on-and-off on a little project called [Sonar](https://github.com/databat-io/sonar).

The project goal is to get real-world analytics for public spaces (such as retail) using wireless means at low cost. This means using Bluetooth and WiFi (the latter is to be added) and a Raspberry Pi. This weekend I finally did a brief [write-up on Hackster](https://www.hackster.io/vpetersson/sonar-wireless-foot-traffic-information-for-retail-b17cc1) where I outlined the project.

Sonar is still in its early days, but you can already use it to collect BLE data from the surrounding, which can provide you with a rough estimate of the amount of people in the surrounding area. The idea is that with sufficient data collected (and with more sensors, such as WiFi), Sonar should be able to learn and provide better analytics. Moreover, with multiple Sonar devices deployed in the same venue, you could triangulate the visitors and provide things like heat maps.

It should also be said that I'm well aware that there are plenty of commercial projects doing similar things, but there were surprisingly few open source projects, which is why I decided to take it on.

Here are some things I have on the roadmap:

- Add support for collecting metrics over WiFi
- Create a proper RESTful API for report data
- Sprinkle ML magic on the dataset to see what shows up :)
