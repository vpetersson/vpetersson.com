---
layout: post
title: A "dead man's switch" for your computer?
date: '2015-01-22T22:03:00+02:00'
tags:
- security
permalink: /post/108852454049/a-dead-mans-switch-for-your-computer
---
In the last few weeks, a lot of details have been disclosed around [Ross Ulbricht’s arrest](http://arstechnica.com/tech-policy/2015/01/silk-road-trial-fbi-reveals-whats-on-ross-ulbrichts-computer-in-open-court/). For those not familiar with the matter, Ulbricht was arrested at a library in San Francisco some time ago with his laptop open. The agents managed to steal the laptop out of Ulbricht’s hands and therefore prevent him from locking the computer (which presumably had full-disk encryption).

This got me thinking; why don’t we have **Dead Man’s Switches** for computers? It would be very simple to create one.

Having such device would not only be useful if you’re a high profile target (like Ulbricht), but also to conveniently lock your computer in an office environment.

Using a USB stick
=================

Hardware
--------

Using just things we have laying around, we should be able to design the most primitive version. All you really need is a USB stick and some strings (or lanyard)

*   Format your USB drive with a some random file on.
*   Make a bracelet out of strings or a lanyard. The string from the bracelet must be long enough such that it isn’t in the way while you’re typing/working. Imagine a modified version of [this](https://www.etsy.com/listing/84615477/scandinavian-usb-stick-leather-braided).

Software
--------

With the hardware ready, we now need a daemon or similar that runs on your computer and checks for this file. If this file disappears (i.e. you remove the USB device), the computer will lock down.

Here’s an example of a very primitive version of such script. All it does is to check for the file every second, and if it is absent, it will lock the computer (assuming you’re using OS X):

    #!/bin/bash
    
    # Where is the file located?
    # Should be something like "/Volumes/<disk label>/<file name> on OS X.
    WATCHFILE="/path/to/file"
    
    while true; do
        if [ -f "$WATCHFILE" ]; then
            sleep 1
        else
            /System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend
        fi
    done
    

_(This script is clearly more meant as a proof-of-concept than for usage in a high security environment.)_

Using wearables
===============

There are a lot of issues with the approach above. First and foremost, it is likely not be very comfortable to work with a strap around your wrist all day. You’re also likely to accidentally drag your laptop off of your desk in an unexpected move.

Secondly, having such device around your wrist is going to look very suspicious (and odd).

So what can we do about this? Given the raise of wearables, there are now a ton of different options available at our disposal.

For instance, we could use a [Fitbit](http://www.fitbit.com/) or [Pebble](https://getpebble.com/) for the same purpose. However, instead of checking for a file, we would check for the proximity of the device over Bluetooth. If the the computer loses connection to the device, it auto-locks.

There are however problems with Bluetooth, as the range can get a little too good for this particular situation. As such, we’d likely have take into account the signal strength. Perhaps we lock the computer if the signal strength goes below a certain level.

Using some sort of wearable technology would clearly require more work than simple USB drive version above, but it would look a lot less suspicious and also also be a lot more convenient.

**Update:** As pointed out by MrMid and Lennaert van Dijke, there is a tool for Linux that can lock your computer with Bluetooth proximity claled [BlueProximity](http://blueproximity.sourceforge.net/). I’d love to see that ported to OS X.

**Update 2:** It appears as there is a tool called [Proximity](https://code.google.com/p/reduxcomputing-proximity/) that claims to be able to do this, but I couldn’t get it to work on Yosemite.

**Update 3:** After some additional research, I’ve found a number of OS X apps that can do this, including [TokenLock](https://itunes.apple.com/us/app/tokenlock/id402433482), [Keycard](https://itunes.apple.com/us/app/keycard/id578513438) and [HandyLock](http://www.netputing.com/applications/handylock/). Unfortunately all of these apps implement their own lock screen. This is presumably because they want to have the ability to unlock the system too using the same mechanism. The problem with this is that you significantly lower the security. The search goes on for an app that can _only_ lock down the system using the built-in tools. I’m not interested in unlocking it.

**Update 4:** I finally found it! The app is called [Bluetooth Screen Lock](https://itunes.apple.com/us/app/bluetooth-screen-lock/id509251123). Unfortunately it doesn’t work with my Fitbit Flex, but it _does_ work just great with my Pebble. ![](/tumblr_files/tumblr_inline_niuu6f5eIe1skxjxc.png)

The one thing I did notice however (which is specific to the Pebble), is that you need to also pair the device with the computer. If not, you can only use it while the watch is Bluetooth Discovery mode (i.e. in the menu).

**Update 5:** While the locking with the Pebble does work great, there is an issue with it – you cannot have the Pebble paired with your phone simultaneously. As such, you unfortunately need to decide if you want to get notifications from your phone _or_ use it to lock your computer.
