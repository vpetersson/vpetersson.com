---
layout: post
title: How to get FreeBSD's CARP working on CloudSigma
date: '2011-03-23T13:34:32+02:00'
tags:
- CARP
- CloudSigma
- FreeBSD
redirect_from: /post/92729944664/how-to-get-freebsds-carp-working-on-cloudsigma
---
For a few months now, we’ve been working on migrating our physical architecture for YippieMove over to CloudSigma. We got everything up and running swiftly, with the exception of one thing: CARP.

As it turns out FreeBSD’s CARP implementation doesn’t really work very well in a virtual environment. (For those curious about the details, please see [this](http://lists.freebsd.org/pipermail/freebsd-net/2011-March/028332.html) mailing list post.)

In order to get up and running with CARP on CloudSigma, you need to do the following:

*   Download the [FreeBSD kernel source](http://www.freebsd.org/doc/handbook/kernelconfig-building.html)
*   Download this [patch](http://www.shrew.net/static/patches/esx-carp.diff) ([mirror](http://viktorpetersson.com/upload/esx-carp.diff))
*   Apply the patch (cd /usr/src/sys/netinet && patch -p0
*   Recompile and install your kernel (make sure to include “device carp” in your kernel config)
*   Add “net.inet.carp.drop_echoed=1″ to /etc/sysctl.conf
*   Reboot into the new kernel

That’s it. You should now be able to set up CARP as usual. For more information on how to configure CARP, please see my article [Setting up a redundant NAS with HAST and CARP](http://viktorpetersson.com/2010/09/27/setting-up-a-redundant-nas-with-hast-with-carp/). That article also includes detailed instructions on how to download FreeBSD’s kernel source and how to compile your kernel.

As a technical side note, I got this working with FreeBSD 8.2 and the kernel source from the RELENG_8 branch.

**Credits:** Matthew Grooms for the patch and Daniel Hartmeier for great analysis.
