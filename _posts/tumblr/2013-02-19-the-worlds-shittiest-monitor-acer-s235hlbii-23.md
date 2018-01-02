---
layout: post
title: 'The world''s shittiest monitor: Acer S235HLBII 23"'
date: '2013-02-19T12:34:36+02:00'
tags:
- Acer
- Raspberry Pi
permalink: /post/92729974889/the-worlds-shittiest-monitor-acer-s235hlbii-23
---
Ok, this a long rant, but I just need to warn anyone else looking to buy this monitor. It’s the worst piece of garbage I’ve ever owned. If you’re thinking about buy one, just don’t. Pretty much anything else you can get your hands on is better.

tl;dr

On paper, it’s a pretty decent monitor. It’s a regular 23″ monitor with 2x HDMI input and one VGA. It seemed pretty ideal, since I was primarily looking to use it for my Raspberry Pi labs. For me, monitors are pretty disposable, and I don’t pay much attention to them these days.

This monitor however must have been created by a bunch of either extremely incompetent engineers, or skilled engineers with an extreme hate for the human race.

For instance, the input detector is so shitty that when you plug in a regular computer to it, you’ll be way into the operating bootup before it even detects the monitor (if at all). That means, there’s no way in you’ll be able to do access the BIOS with this monitor (unless you know the exact key combinations (and no, it’s not just ‘Delete’ as it used to be in the good old days)). When using this monitor with the Raspberry Pi, things gets way worse.

In order for this piece of garbage to detect the Raspberry Pi, you need to carefully time when you power up the Raspberry Pi compared to the power up cycle for the monitor. If you either power up the Raspberry Pi too early, or too late, it won’t detect it at all and go to sleep.

Then there’s the monitor’s menu system. You’d imagine that a feature like switching between inputs on a monitor with three inputs would be pressing one key. Nope, on the Acer S235HLBII, you need to dive into the menu and dive into a submenu to do this. Moreover, **you can’t even get to the menu if the monitor can’t detect any input**.

If you could at least force the monitor to a given input, I guess I could live with this monitor, but you can’t. It will automatically jump back and fort in order to its own pathetic probing.

For the above reasons, I want to congratulate Acer for designing the world’s shittiest monitor.
