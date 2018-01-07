---
layout: post
title: How to install Yosemite and Ubuntu Linux side-by-side with full disk encryption
date: '2014-10-05T17:47:00+03:00'
tags:
- Yosemite
- os x
- ubuntu
- encryption
- fde
- lvm
- security
- apple
- mac os x
- paranoia
- ubuntu linux
- linux
redirect_from: /post/99231293399/how-to-install-yosemite-and-ubuntu-linux
---
This weekend I spent a bit of time playing around with my old MacBook Pro. My goal was to set it up as a backup/test laptop. What I wanted to accomplish was the following:

*   Install Yosemite with Full Disk Encryption (FDE)
*   Install Ubuntu Linux 14.04 LTS with FDE (using LVM)

As it turns out, this was a lot more challenging than I thought. My initial approach was to simply split the disk into two partitions and just install each operating system separately. Once installed, I was planning to simply enabled FileVault inside OS X (Ubuntu allows you to enable encryption during the installation).

Unfortunately, it wasn’t that easy. Here are some observation:

*   If you install Yosemite on the full disk and enable FDE, you cannot resize the disk (neither using `hdiutil` or Disk Utility).
*   If you install Yosemite on one of the two partitions, you cannot enable FileVault inside OS X. This is probably due to the lack of Recovery partition[*](https://discussions.apple.com/thread/3222378?start=0&tstart=0).

The solution to my problem was to fire up Disk Utility inside the Yosemite installer, split the disk into two partition. With that done, I then re-formatted the OS X partition as ‘Journaled, Encrypted’.

This allowed me to install Yosemite just fine. Afterwards I could install Ubuntu (which was never a problem) onto the other partition.

To switch between the OS’s, I simply hold down the option key on boot.

The only drawback with this approach as far as I can tell is that you lose the OS X recovery partition. For me however, that’s not a big deal, as I can always boot it off of a USB drive or SD card. A guide on how to create such device can be found [here](/2014/09/18/create-a-bootable-usb-drive-for-yosemite-the-easy.html).
