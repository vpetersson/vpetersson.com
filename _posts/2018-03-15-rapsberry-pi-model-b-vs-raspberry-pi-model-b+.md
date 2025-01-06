---
layout: post
title: Network Performance - Raspberry Pi 3 Model B vs Raspberry Pi 3 Model B+
date: '2018-03-15T13:00:00+01:00'
tags:
- raspberry-pi
- linux
- performance
---

Today I got my hands on the new Raspberry Pi 3 Model B+. One of the most notable new features is Gigabit Ethernet. Given that the Raspberry Pi still uses the USB 2 interface for the Ethernet controller, I was curious to see what kind of bandwidth it could handle (I know the MagPi [already published this](https://www.raspberrypi.org/magpi/raspberry-pi-3-specs-benchmarks/), but I wanted some independent numbers). To do that, I setup a simple experiment:

* One Raspberry Pi 3 Model B+
* One Raspberry Pi 3 Model B
* A single SD card with the latest Raspbian (that I moved between the boxes)
* One Gigabit switch
* A Linux box to perform the test from (wired to the network)

For the test, I used the classic network testing tool `iperf`.

So how did it go? Turns out that it is almost three times as fast. It is nowhere near full Gigabit speed, but it is still a nice performance improvement.

![](/assets/pi3-vs-pi3+.png)

The data is in Mbits/sec. You can find the raw numbers [here](https://gist.github.com/vpetersson/d6daa360bb207142faf6c555ff84b17f).
