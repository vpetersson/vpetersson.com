---
layout: post
title: "“War dialing” with Skype"
date: '2015-09-08T20:01:04+03:00'
tags:
- skype
- python
- ubuntu
- linux
permalink: /post/128648706034/war-dialing-with-skype
---
(Fine, this isn’t [war dialing](https://en.wikipedia.org/wiki/War_dialing) in the 90s context, but it made for a good title.)

As furious I am with Lufhansa’s [strike](http://www.independent.co.uk/news/business/lufthansa-passengers-grounded-as-pilots-launch-two-day-strike-10491256.html), it did give me time to write a fun script.

With the announcement of the strike, Lufthansa’s customer service lines were brought to their knees. After trying to manually call a few of them (in different countries), I finally gave up with the manual mode and instead decided to automate this.

The result looks like this:

![](http://78.media.tumblr.com/52ecd2651f1db1d987cecfa7068847ea/tumblr_inline_nuddo9DjCQ1skxjxc_540.png)

Using the [Skype4Py Python module](https://pypi.python.org/pypi/Skype4Py), it was able to automate the redail process with realtive ease. While I wasn’t able to get it working on Mac OS X, I was able to get it running in an Ubuntu VM more or less out-of-the-box.

The final script looks like this:
