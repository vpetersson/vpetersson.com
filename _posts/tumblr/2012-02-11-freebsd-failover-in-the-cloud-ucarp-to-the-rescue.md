---
layout: post
title: FreeBSD failover in the cloud -- UCARP to the rescue
date: '2012-02-11T17:32:15+02:00'
tags:
- CARP
- FreeBSD
- KVM
- QEMU
- UCARP
redirect_from: /post/92729959439/freebsd-failover-in-the-cloud-ucarp-to-the-rescue
---

I’m a big fan of FreeBSD. However, as painful it is to admit, it isn’t always the best OS to run in the cloud. Compared to Linux, you will get worse network and disk performance even with Virtio installed. There are also other issues. For instance, it is likely that you won’t get [CARP](http://www.freebsd.org/doc/handbook/carp.html) to fully work (while this works perfectly fine with OpenBSD’s CARP, and Linux’s VRRP). I have [written about workarounds](http://viktorpetersson.com/2011/03/23/how-to-get-freebsds-carp-working-on-cloudsigma/) for this issue in the past, but they do not seem to work equally well in FreeBSD 9.0.

Luckily, there is a userland implementation of CARP called UCARP that works better than CARP. It’s also very similar to CARP when it comes to configuration.

Unfortunately UCARP’s [website](http://www.ucarp.org/project/ucarp) includes more or less zero documentation, so I’ll help you get started. I won’t talk too much about what CARP is, as I assume you already know that if you’re reading this. There is however one major difference between CARP and UCARP — UCARP doesn’t have its own dedicated interface. Instead it relies on IP aliases that are brought up and down with the scripts below.

First of all, you need to install UCARP from ports:

    cd /usr/ports/net/ucarp/ && make clean install

We now need to enable UCARP in rc.conf by adding the following:

    ucarp_enable="YES"
    ucarp_if="vtnet1"
    ucarp_vhid="1"
    ucarp_pass="carppass"
    ucarp_preempt="YES"
    ucarp_facility="daemon"
    ucarp_src="192.168.10.10"
    ucarp_addr="192.168.10.1"
    ucarp_advbase="2"
    ucarp_advskew="0"
    ucarp\_upscript="/usr/local/bin/ucarp\_up.sh"
    ucarp\_downscript="/usr/local/bin/ucarp\_down.sh"

I’m not going to go into too much details about the above variables. You can read more about them [here](http://www.freebsd.org/cgi/man.cgi?query=carp&sektion=4). You will however most likely need to change _ucarp_if_, _ucarp_src_, _ucarp_addr_, _ucarp_advskew_, and _ucarp_advbase_ to match your environment. They’re mostly self-explanatory. The only somewhat confusing ones I guess would be _ucarp_src_, which is the host’s IP and _ucarp_advskew_, which determines priority (the lower value will become master).

Next, we need to create two script that will be triggered in the two different states.

**ucarp_up.sh**

    #!/bin/sh

    # Load variables from rc.conf
    . /etc/rc.subr
    load\_rc\_config ucarp

    /sbin/ifconfig $ucarp\_if alias $ucarp\_addr/32

**ucarp_down.sh**

    #!/bin/sh

    # Load variables from rc.conf
    . /etc/rc.subr
    load\_rc\_config ucarp

    /sbin/ifconfig $ucarp\_if -alias $ucarp\_addr/32

With all of those files in place, you can simply start ucarp with:

    /usr/local/etc/rc.d/ucarp start

## Closing thoughts

Once you’ve gotten the UCARP working, it’s time to tie it into your desired workflow. Contrary to CARP, which relies on dev.d for triggar-actions, you will use ucarp\_up.sh and ucarp\_down.sh.

The biggest downside perhaps with UCARP is that you can’t bind an application on the failover IP when the node is in backup mode, like you can with CARP. As a result, you will need to work a bit harder when scripting your up/down actions. There is however one benefit with UCARP — you can configure it to run actions **prior** to bringing up the new interface. That can be handy if you need to do something before the node steps up as mater.
