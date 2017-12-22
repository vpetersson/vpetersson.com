---
layout: post
title: Trouble with ZoneMinder VA 0.2 and VMware Server 2
date: '2010-05-17T13:53:57+03:00'
tags:
- ZoneMinder
permalink: /post/92729915584/trouble-with-zoneminder-va-0-2-and-vmware-server-2
---
Last week I launched [ZoneMinder VA 0.2](http://viktorpetersson.com/open-source/zoneminder-virtual-appliance/). Unfortunately there is an issue with the image that prevents it from loading properly into VMware Server 2. The root of the problem is actually an incompatibility issue between VMware Fusion and VMware Server, but that doesn’t matter. Fortunately the workaround is pretty simple.

\- Delete any vmdk.lck directries  
\- Delete any vmem.lck directories  
\- Delete the quicklook-cache.png file  
\- Edit the .vmx file and set to FALSE entries for USB, SOUND and SERIAL.
