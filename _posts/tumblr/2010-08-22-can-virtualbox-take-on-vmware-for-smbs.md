---
layout: post
title: Can VirtualBox take on VMware for SMBs?
date: '2010-08-22T19:42:45+03:00'
tags:
- Linux
- VirtualBox
- Virtualization
- VMware
- Xen
redirect_from: /post/92729922304/can-virtualbox-take-on-vmware-for-smbs
---

My experience with VMware goes way back. I think the first version I ever used was VMware Workstation 4.0 back in ’03. That’s seven years ago. Back then it was really cool as a proof-of-concept, but not very useful as the hardware didn’t have enough power (primarily RAM) to run multiple OS’es simultaneously (or, at least **my** hardware).

A few years ago I started to use VMware more seriously. [VMware Server](http://www.vmware.com/products/server/) was great. It ran on Linux and was pretty flexible. It lacked a few features (such as multiple snapshots), but it did the job. When we first launched [YippieMove](http://www.yippiemove.com), we actually ran the entire architecture with a few VMware Servers. It worked, but due to budget hardware, it didn’t perform as well as we liked it to. (We eventually switched to FreeBSD Jails and [the article we wrote](http://www.playingwithwire.com/2009/06/virtual-failure-yippiemove-switches-from-vmware-to-freebsd-jails/) about it made it to Slashdot.)

As time elapsed, a few things started to bug me more and more with VMware Server. The 2.0-release resolved some of these, as it introduced a web-interface, and you no longer needed “VMware Console” to manage the virtual machines. Yet, the web interface is pretty buggy. The web interface crashes quite frequently, and you need to reload the entire window. Sometimes the login screen won’t show up at all, and you need to reload the window like 10 times before it shows up. **Perhaps the most frustrating thing with VMware Server is the lack of OS X support for the console** (which is a Firefox plug-in). In order to access the console, you need to be either on Windows or Linux. Hence I need to fire up VMware Fusion with a Linux guest-OS or remotely connect to a Windows machine in order to access the console. Very frustrating to say the least. There are also other frustrating issues, such as the incompatibility between VMware Fusion and VMware Server.

![VMware_Server_web_interface](http://viktorpetersson.com/wp-content/uploads/2010/08/VMware_Server_web_interface-600x278.png "VMware_Server_web_interface")\
_VMware Server 2 in action._

Since the release of VMware Server 2.0, there have been two bug-fix releases. The latest version, 2.0.2, was released on October 26, 2009. That’s over 9 months ago. I definitely reckon that VMware do not put a whole lot of engineering resources into a free product. The rational for giving away VMware Server for free is supposedly that it is a stepping stone for SMBs into VMware ESX. That makes sense. When you grow out of VMware Server, you can simply take all your existing Virtual Machines and plug them straight into ESX, and get features like clustering with failover.

Given that VMware is more or less the industry standard for virtualization, why would you want to use anything else? The above issues with VMware Server, as well as a very slow release cycle (perhaps even frozen development), have lead me to research alternatives. Xen is an obvious alternative. If it can power Amazon’s EC2, it obviously scales well. Yet, it falls short of a pretty important criteria for me: Platform independence. I want to be able to create a virtual machine on my local machine, and then move it to the server when it is done. Xen only works on Linux as a host OS. (The FreeBSD guest-OS is also very experimental). I also find it surprising that there is no real good web-based management tool for Xen (or perhaps I just failed to find it). There are a ton of ‘projects’ but no clear choice.

With Xen out of the picture, we’re only left with the newcomer: VirtualBox. The Open Source Edition is more or less at par with VMware Server when it comes to features (eg. VirtualBox can do multiple snapshots, but VMware Server can handle USB pass-trough). VirtualBox runs on most operating systems (Mac, Linux, Windows and even FreeBSD).

The deal breaker for me used used to be the lack of web-interface in VirtualBox. Then along came [phpVirtualBox](http://code.google.com/p/phpvirtualbox/). It’s open source and uses simple components, such as PHP to display the data (VMware Server uses Tomcat, which is pretty much the opposite of lightweight). phpVirtualBox also supports access to the console directly in the browser. You’re no longer restricted to Firefox on Windows and Linux.

![phpVirtualBox](http://viktorpetersson.com/wp-content/uploads/2010/08/phpvbsm-600x445.png "phpVirtualBox")\
_phpVirtualBox in action._

**Let’s revisit the original question**: Can VirtualBox take on VMware for the SMB market? I definitely think so. The Open Source Edition of VirtualBox is very responsive and as far as features goes I’d say it is at par with VMware Workstation as a stand-alone machine. Throw in phpVirtualBox to the mix, and I’d say it is at par with VMware Server. Since VMware have more or less ceased the development of VMware Server, it could be a good time to switch. Yet, this assumes that you do not need features like clustering, failover and disaster recovery etc. If you only need a few headless boxes to run various services on, VirtualBox can do the job for you, and probably better than VMware Server does today.

The only question mark that pops up in my head with VirtualBox is: What is Oracle’s strategy with VirtualBox? There is a commercial fork of VirtualBox, but there are very little data available about it on VirtualBox’s website (other than [an outline of the difference](http://www.virtualbox.org/wiki/Editions) between the two editions). You can download the commercial version for free for personal use, but there is no pricing available for commercial use. That said, VirtualBox Open Source Edition was released under GPL, so regardless of what Oracle decides to do with VirtualBox, the source code is still there for developers to fork their own release.
