---
layout: post
title: Introducing KISS-surveillance -- The dead simple surveillance solution
date: '2012-01-08T22:45:12+02:00'
tags:
- KISS-surveillance
- Video Surveillance
- ZoneMinder
redirect_from: /post/92729953989/introducing-kiss-surveillance-the-dead-simple-surveillan
---
You’ve probably already noticed that I’ve used [ZoneMinder](http://www.zoneminder.com/) a bit. I published a few [blog-posts](http://viktorpetersson.com/tag/zoneminder/) on how to set up ZoneMinder, and even posted full [virtual appliance](http://viktorpetersson.com/open-source/zoneminder-virtual-appliance/) for ZoneMinder.

The problem with ZoneMinder though, in my opinion, is that it is overkill for most users. Yes, it comes with some really cool features, but if all you want to do is to snap one image per second from an IP-camera for instance, it is way too complex. Don’t get me wrong, ZoneMinder is a great application if you have complicated surveillance needs. This just wasn’t my case.

After running into some issues with ZoneMinder I decided to write a lightweight alternative, namely [KISS-surveillance](https://github.com/vpetersson/KISS-surveillance). It doesn’t even offer a fraction of all features ZoneMinder does, but it come with a few major benefits:

* Uses a fraction of the resources of ZoneMinder.
* Fast and easy to setup.
* No database-requirement. Just plain files.
* Only uses simple UNIX-tools like wget, crontab and Supervisor.
* If you want to view the images from a web-browser, simply configure the web-server of your choice to do an index on the given folder (I prefer Nginx).

![](http://viktorpetersson.com/wp-content/uploads/2012/01/KISS-surveillance-600x493.png "KISS-surveillance")

I’ve used this tool now for a few months now without any issues whatsoever. It might not be pretty, but it is simple and reliable, which for me is all I need when it comes to video surveillance.

As far as compatibility goes, KISS-surveillance should work with any IP-based camera that supports static images over HTTP or HTTPS.

For further instructions and to download KISS-surveillance, please [visit its home on Github](https://github.com/vpetersson/KISS-surveillance).
