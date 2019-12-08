---
layout: post
title: VMWare Fusion error - cannot open /dev/vmmon
date: '2019-12-08T13:00:00+01:00'
tags:
- vmware
- fusion
- virtualization
- note-to-self
---

This weekend I needed to use Fusion for the first time since I upgraded to macOS Mojave. Having run Fusion 8 for many years and being happy with it, I was somewhat annoyed with needing to upgrade to Fusion 11. At least that appeared to be the consensus on the interwebs. In retrospect, I'm not 100% sure. That said, I've received great value from Fusion, and I don't mind paying money for good software.

Unfortunately, after upgrading I received a similar error as before with Fusion 8: "Cannot open /dev/vmmon: No such file or directory". After spending a fair bit of time researching this error, the verdict on the VMWare forum appears to say that you cannot have VMWare Fusion **and** VirtualBox install simultaneously and that you need to uninstall VirtualBox. Since I occasionally use VirtualBox (through Vagrant), that felt like a sub-bar solution. Fortunately, I found [this blog post](https://www.kastelo.net/blog/2017-05/coexisting-virtualbox-vmware-fusion-macos/) that outlines how to simply unload/load the VirtualBox kernel modules on demand instead.

However, after doing this, my error still remained. As it turns out, I have missed some kind of System Preferences dialogue where I allowed Fusion to load its kernel modules. Details can be found [here](http://www.programmersought.com/article/9068165406/). Hence, if your error still remains, make sure that you double check that. Doing this would have saved me time.
