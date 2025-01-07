---
layout: post
title: How to boot from USB with Grub2
date: '2014-07-29T09:06:00+03:00'
tags:
- ubuntu
- grub
- usb-boot
- grub2
- linux
redirect_from: /post/93191892924/how-to-boot-from-usb-with-grub2
---
Yesterday, I had to rescue a broken Ubuntu 14.04 installation by booting from USB. Unfortunately, I was unable to get into the BIOS to change the boot order (because of a BIOS password and a bad memory).

Fortunately, since I was able to get to Grub, it was still possible. Here’s how I did it:

* Create a bootable USB drive (using something like [Startup Disk Creator](https://apps.ubuntu.com/cat/applications/usb-creator-gtk/). Before taking the drive out, locate where the `vmlinuz` and `initrd.*` files are located. You’ll need them later.
* Insert the USB drive and boot the system. When you get to Grub, press _c_ to get to the ‘command-line’ option.

Here is where it gets a bit tricky. In my case, I knew the root partition on the USB disk was `/dev/sda1`, yours may vary.

Since Grub uses a slightly different device mapper, let’s use it to find the partitions:

    grub> ls
    (hd0) (hd0,msdos5) (hd1) (hd1,msdos0)

This will show you the available devices. In my case, the relevant partition was `(hd1,msdos1)`. Now, let’s use this information, along with our knowledge of where the `vmlinuz` and `initrd` files are to boot the system:

    grub> linux (hd1,msdos1)/install/vmlinuz root=/dev/sdb1
    grub> initrd (hd1,msdos1)/install/initrd.gz
    grub> boot

That’s it. You should now be able to boot straight into Ubuntu. This should even work if your BIOS doesn’t support booting off of USB.
