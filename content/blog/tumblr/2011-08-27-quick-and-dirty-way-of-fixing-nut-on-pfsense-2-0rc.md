---
slug: quick-and-dirty-way-of-fixing-nut-on-pfsense-2-0rc
title: Quick and dirty way of fixing NUT on pfSense 2.0RC
date: '2011-08-27T19:39:49+03:00'
tags:
- FreeBSD
- NUT
- pfSense
aliases: /post/92729949844/quick-and-dirty-way-of-fixing-nut-on-pfsense-2-0rc
---

One of my favorite Open Source appliances is [pfSense](http://www.pfsense.org/). It can turn any old machine into a very powerful firewall/router in 10 minutes or less. Also, it comes with a very handy GUI and the fact that it is based on FreeBSD makes it even greater.

While version 2.0 isn’t stable yet, the 2.0RC is more or less considered stable. It’s also a major update to the 1.2-branch. I’ve used 2.0 on two ‘production’ firewalls now, and I think it more reliable than 1.2.

There is however one major problem that bugs me with 2.0 — The Nut-package ([Network UPS](http://www.networkupstools.org/)) is broken.

While I probably should have created a proper fix for the problem instead of this quick-and-dirty fix, I can’t find the time to do so.

Start by installing the package. As you’ll notice, even if you play around with the settings, you can’t get it to work. Instead SSH into your pfSense-box.

Kill all NUT processes that pfSense may have started (“ps aux | grep -e nut -e ups” should help you find them).

Now dive into the folder which holds NUTs settings, namely “/usr/local/etc/nut”. This folder holds a few config files for NUT.

The most critical one that you’ll need to fix is ups.conf. By default, this file will look something like this:

    user=root
    \[UPS\]
    driver=genericups
    port=auto

The part that really screws up NUT is ‘port=auto’. That’s why it won’t start. Also, depending on your configuration, your file will look different. I have an APC Smart-UPS connected with a serial cable, so mine looks like this:

    user=root
    \[UPS\]
    driver=apcsmart
    port=/dev/cuau1
    sdtype=0

Once you’ve made those changes, you should now be able to start NUT with:

    /usr/local/etc/rc.d/nut.sh start

Assuming everything went well, you can now see the status of your UPS in pfSense’s NUT monitor. That’s all great. The problem is, as soon as you restart your pfSense box, or touch anything in ‘NUT Settings,’ you’ll overwrite all changes. To deal with that, we have to do a dirty hack.

The settings pfSense overwrites your configs with are stored in ‘/usr/local/pkg/nut.inc’. Hence, a more elegant hack would be to update this file with appropriate settings. I didn’t have time to do that, so I instead told pfSense to write the config files to a different path.

To do so, open up ‘/usr/local/pkg/nut.inc’ and edit line 37 from

    define('NUT_DIR','/usr/local/etc/nut');

to

    define('NUT_DIR','/usr/local/etc/nut-fake');

Also, don’t’ forget to create ‘/usr/local/etc/nut-fake’.

Now when you reboot or change anything in NUT Settings in the US, the changes will be written to /usr/local/etc/nut-fake and not /usr/local/etc/nut. Hence, the changes you make won’t affect NUT.

**Update**: I just upgraded to 2.0-RELEASE (the 2.0 stable-version) and this problem still remains.

**Update 2**: After upgrading to 2.0.1, I can confirm that the issue still remains. Yet, this is probably a package-specific issue and not related to the version of pfSense per se.
