---
slug: databat-is-back
title: Databat is back!
date: '2020-06-04T13:00:00+01:00'
tags:
- raspberry-pi
- iot
- sensors
- databat
---

![](/assets/bat.svg)

[A few years ago](/2018/03/19/sonar-databat-people-counter/), I created a people tracker called [Sonar](https://github.com/databat-io/sonar) and open sourced it. The goal of the project was to monitor foot traffic in retail environments. After deploying it and more or less forgetting about it for almost two years, I was reminded about it last month and decided to resurrect it. The good news is that the device that I deployed in a retail environment as a test was still ticking along just fine.

A lot of things have changed since I last touched the project, which allowed me to remove a number of the hackish workarounds and make it more robust. As I was able to make the project more reliable, I also started to work on offering this as service. I've created [databat.io](https://databat.io), and populated it with a [waitlist](https://databat.io/waitlist/) for anyone interested in this service.

The idea is to keep the project hybrid, where the code that goes on the Raspberry Pi open source, but it can be configured to report data into a central interface, which will be useful for users with multiple devices (similar to the model we use at [Screenly](https://screenly.io)).

**Recent updates:**

- Refactored runtime to use Docker (and Docker-compose), which is compatible with [Balena](https://balena.io)
- Added support for running on Raspbian/Raspberry Pi OS
- Added support for Raspberry Pi 4 Model B
- Improved Bluetooth logic to make it more robust
- Added PostgreSQL support (if you want to use an external database)
