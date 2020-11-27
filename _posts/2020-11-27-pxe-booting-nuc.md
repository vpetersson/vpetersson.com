---
layout: post
title: Solving NUC USB boot issue with PXE boot
date: '2020-11-27T13:00:00+01:00'
tags:
- debian
- linux
- nuc
- pfsense
- ubuntu
---

I recently wanted to reinstall my trusty old Linux workstation with Debian 10. I imagined this would be a straight-forward thing to do. Just download the ISO and flash it out to a USB stick and be off to the races.

Well. It wasn't.

As it turns out, some [NUCs do not like modern USB sticks](https://community.intel.com/t5/Intel-NUCs/NUC-not-booting-from-USB/td-p/502254). After trying two or three different USB sticks I had laying around, none of them were picked up by the system (neither as booting devices or for flashing the BIOS). Since I bought a few "good" USB sticks last year, I gave away or threw away the "crap" ones...the ones that the NUC would have accepted.

Since really needed to re-install the machine such that I could use it for some heavy Docker builds, I needed to come up with a workaround. This is when I realized that I could in theory install Debian using PXE boot. I was a bit hesitant at first, but then I ran across [netboot.xyz](https://netboot.xyz/). In short netboot.xyz is a boot image that allows you to select among a large number of distributions and tools.

![](/assets/netboot.png)

As it turns out, configuring PXE booting on my [pfSense](https://www.pfsense.org/) ended up [being a breeze](https://figura.im/posts/2020/01/pfsense-as-a-netboot.xyz-server/). Within a matter of minutes, I was able to boot my NUC into the Debian Buster installer. As a bonus, I'm also able PXE boot VMs instead of having to download ISOs.
