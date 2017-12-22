---
layout: post
title: How to find a network device when using Internet Sharing on Mac OS X
date: '2015-11-19T17:14:41+02:00'
tags:
- raspberry pi
- networking
- IoT
- mac os x
- el capitan
permalink: /post/133534209969/how-to-find-a-network-device-when-using-internet
---
The built-in Internet Sharing in OS X is very handy. When I’m on the road, I frequently use this to share my laptops WiFi connection with other devices over a wired connection (such as a Raspberry Pi, when I work on [Screenly](http://www.screenlyapp.com)).

![Internet Sharing on OS X](http://78.media.tumblr.com/5a4357aec14257f49d8ae91bfbadbe91/tumblr_inline_ny2ky0ZeW01skxjxc_540.png)

If you’re connecting some kind of headless device, you will likely want to connect to this device over SSH or similar. The only problem is that you don’t know the IP address of said device (it’s headless, remember).

Luckly, all the tools you need are already available on OS X. All you need to do is to fire up the Terminal:

![arp scan and SSH](http://78.media.tumblr.com/d0cd3163ef7151dfa25970d8447b28ae/tumblr_inline_ny2kysKTry1skxjxc_540.png)

Simple as pie.
