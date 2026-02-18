---
slug: zoneminder-as-a-people-counter
title: ZoneMinder as a people counter?
date: '2015-02-01T18:00:00+02:00'
tags:
- zoneminder
- linux
- video surveillance
aliases: /post/109783642994/zoneminder-as-a-people-counter
---

In recent years, it has become fairly common within the retail space to use (IP-based) surveillance cameras to track foot traffic (this can also be referred to as a “people counter”). This is a great idea, as it allows you to re-use existing hardware instead of having to install additional sensors.

There are numerous commercial solutions out there that are capable of doing this. I have however not been able to find any complete open source product that can track foot traffic (at least not bi-directional). I did find a few examples of OpenCV based projects, such as [this one](https://www.youtube.com/watch?v=OWab2_ete7s), but no source code.

That got me thinking; [ZoneMinder](http://www.zoneminder.com/) is a popular open source video surveillance tool. Since I spent some time developing a Virtual Machine, I'm somewhat familiar with it. Not only does it support a large number of cameras (both V4L devices and IP cameras), it also comes with a number of trigger and alert abilities.

Using ZoneMinder, we should in theory be able to create a people counter. In a perfect world, the camera would be located in a hallway and pointed directly down from the ceiling, but it should work otherwise too.

Here’s what you would do:

- Configure your camera(s) in ZoneMinder.
- Define two zones narrow zones such that all people will pass through both zones (let’s call these “z1” and “z2”).

For instance, if a person comes into the store, they’d first pass through z1, and then z2. If they were to leave the store, the customer would pass z2 and then z1.

While I haven’t tested the next step, in theory, it would be possible to set up an alarm/filter based on this. Since these filters can execute external commands, it would be simple to make ZoneMinder call a script, which in turn triggers a ping to some database, such as [Grafana](http://grafana.org/), [Graphite](http://graphite.wikidot.com/) or similar.

Since I haven’t tested this last step, I don’t know if this is possible. However, if it does work, this would allow us to create a very cost effective people tracker.

I should also point out that my initial idea was to use a Raspberry Pi and attach some sort of IR sensor (over USB), but that would require additional hardware.
