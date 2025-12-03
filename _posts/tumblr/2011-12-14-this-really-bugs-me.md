---
layout: post
title: This really bugs me...
date: '2011-12-14T13:39:38+02:00'
tags:
- FreeBSD
- Ghostscript
- ImageMagick
redirect_from: /post/92729951749/this-really-bugs-me
---

If you’ve ever tried to install [ImageMagick](http://www.imagemagick.org/) on FreeBSD, you’ve probably run into this issue too. You have a head-less box in some datacenter, you don’t want to bloat the machine with X11.

You try to install the no-X11-version of Image Magick:

    cd /usr/ports/graphics/ImageMagick-nox11 && make install

The next thing you know, you the dependency ‘print/ghostscript9-nox11′ gets installed. Notice that this is the ‘no-x11′ version. Yet, look at the fifth option from the top:\
![FreeBSD Ports-failure](https://vpetersson.com/wp-content/uploads/2011/12/Screen-Shot-2011-12-14-at-1.34.06-PM.png "FreeBSD Ports-failure")

Isn’t it pretty obvious that I **don’t** want X11 if I install the ‘nox11′ port? Why is that even an option?
