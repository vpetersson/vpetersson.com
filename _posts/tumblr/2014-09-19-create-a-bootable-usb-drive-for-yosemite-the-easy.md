---
layout: post
title: Create a bootable USB drive for Yosemite the easy way
date: '2014-09-19T00:22:00+03:00'
tags:
- yosemite
- osx
- '10.10'
- usb-boot
- mac os x
permalink: /post/97840863794/create-a-bootable-usb-drive-for-yosemite-the-easy
---
Today I decided to take Yosemite for a spin on my old laptop.

Since installing from USB is the only way to do a _clean_ install, I started googling around for exact steps (which were somewhat messy).

To my surprise, it appears as Apple also realized that this was messy and decided to bake in a solution for this. It isn’t however completely obvious, but here is the command:

    $ sudo /Applications/Install\ OS\ X\ Yosemite\ Developer\ Preview.app/Contents/Resources/createinstallmedia --volume /Volumes/your_flash_drive / --applicationpath /Applications/Install\ OS\ X\ Yosemite\ Developer\ Preview.app/
    

![](/tumblr_files/tumblr_inline_nc4cdfJwWd1skxjxc.png)

**Protip:** If you want to speed things up, use a Class 10 SD card instead of an USB drive. These cards are faster than most vanilla USB drives, and any modern Mac will boot off of them just fine.

For more information on how to use this, please see [this](http://support.apple.com/kb/HT5856) page.
