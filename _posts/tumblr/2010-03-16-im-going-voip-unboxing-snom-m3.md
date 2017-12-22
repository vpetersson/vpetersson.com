---
layout: post
title: 'I''m going VoIP - Unboxing Snom M3. '
date: '2010-03-16T17:44:23+02:00'
tags: []
permalink: /post/92729911829/im-going-voip-unboxing-snom-m3
---
For many years I’ve been excited about VoIP. I attended a seminar on Asterisk 7 years or so ago, and remember thinking: Wow, this is the future. Unfortunately there were many things holding VoIP back then (bandwidth being the most obvious one). However, today most companies can get a decent internet connection (10Mbit up and down will do). Moreover, you won’t even have to get dirty with setting up your own Asterisk server today, you can simply go for a hosted PBX-solution. This is both cheaper (assuming you can’t do it yourself) and probably more reliable.

This is exactly what I’m going for. After playing around with [Trixbox](http://www.trixbox.org) (a turn-key Asterisk appliance), I realized that the burden of managing the system myself (setting up HA, maintaining the software etc.) exceeds the benefit. Hence I decided to go for a hosted solution.

The beauty with going for a hosted solution is that you just need to plug in the IP phones into the network, and you’re good to go. It’s almost as easy as plugging in a traditional PSTN phone. (The only exception is that you need to configure the credentials to the PBX).

After speaking with a few people who knows VoIP well, I decided to go with [Snom](http://www.snom.com)-phones. They’re both cheap and offers great features. Moreover, the Snom M3 is DECT phone (it uses DECT to communicate with the base station). This means that you get much better battery-life than a WiFi phone.

I ordered two Snom M3 (one kit and one extra handset) as well as a repeater to try out before I ordered more. So far I’m a happy camper. The Snom M3 reception is so great that I don’t even need the repeater, even though the office has really thick walls and is two stories.

The only trouble I’ve encountered this far is when I do SIP to SIP calls. Apparently, there is a bug in [pfSense](http://www.pfsense.org) (the router software) that interferes.

Yet, so far I’m happy with the result. As soon as I’ve resolved the problem with pfSense, I’m ready to move on and test the workflow for the incoming calls that I’ve created.

### Unboxing photos

\[flickr-gallery mode=“photoset” photoset=“72157623508061475”\]
