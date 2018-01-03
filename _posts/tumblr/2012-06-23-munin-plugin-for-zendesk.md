---
layout: post
title: Munin-plugin for Zendesk
date: '2012-06-23T17:53:24+03:00'
tags:
- FreeBSD
- Linux
- Munin
- Ubuntu
- Zendesk
redirect_from: /post/92729963844/munin-plugin-for-zendesk
---
In recent time, I’ve really started to appreciate Munin. I’ve deployed Munin in multiple architectures already, and I still get impressed every time by how easy it is to setup.

I also really like how easy it is to write plugins. For a crash-course in writing plugins for Munin, take a look at [this](http://munin-monitoring.org/wiki/HowToWritePlugins) page.

Since I first deployed Munin to monitor [YippieMove](http://www.yippiemove.com)‘s architecture, I’ve written a handful of custom plugins to visualize various datapoints. However, one thing I’ve been wanting for some time was to a tool to visualize the volume of support tickets. Since we use [Zendesk](http://www.zendesk.com/) for support and the fact that they already got an API, all data I needed was already accessible.

I started writing the plugin this morning, and few hours later I had written one plugin for plotting all tickets (with their state), and another one for customer satisfaction.

If you want to take it for a spin, I’ve published it on [Github](https://github.com/vpetersson/munin_zendesk).
