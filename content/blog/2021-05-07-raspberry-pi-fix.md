---
slug: raspberry-pi-fix
title: Solving 'dpkg-divert error unable to change ownership of target file' on Raspberry Pi
date: '2021-05-07T13:00:00+01:00'
tags:
- debian
- linux
- raspberry-pi
- raspbian
- note-to-self
---

I've run into the following error myself a number of time in recent time, and just wanted to document the solution for this in case other people run into it too:

Here's the problem:

- You are trying to upgrade your Raspberry Pi to the latest version
- When you upgrade the kernel, it chokes with an error like this:

```
> $ sudo apt upgrade
Reading package lists... Done
Building dependency tree
Reading state information... Done
Calculating upgrade... Done
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
5 not fully installed or removed.
After this operation, 0 B of additional disk space will be used.
Do you want to continue? [Y/n]
Setting up raspberrypi-kernel (1.20210430-1) ...
Removing 'diversion of /boot/kernel.img to /usr/share/rpikernelhack/kernel.img by rpikernelhack'
dpkg-divert: error: unable to change ownership of target file '/boot/kernel.img.dpkg-divert.tmp': Operation not permitted
dpkg: error processing package raspberrypi-kernel (--configure):
 installed raspberrypi-kernel package post-installation script subprocess returned error exit status 2
Setting up raspberrypi-bootloader (1.20210430-1) ...
Removing 'diversion of /boot/start.elf to /usr/share/rpikernelhack/start.elf by rpikernelhack'
dpkg-divert: error: unable to change ownership of target file '/boot/start.elf.dpkg-divert.tmp': Operation not permitted
dpkg: error processing package raspberrypi-bootloader (--configure):
 installed raspberrypi-bootloader package post-installation script subprocess returned error exit status 2
dpkg: dependency problems prevent configuration of libraspberrypi0:
 libraspberrypi0 depends on raspberrypi-bootloader (= 1.20210430-1); however:
  Package raspberrypi-bootloader is not configured yet.

dpkg: error processing package libraspberrypi0 (--configure):
 dependency problems - leaving unconfigured
dpkg: dependency problems prevent configuration of libraspberrypi-bin:
 libraspberrypi-bin depends on libraspberrypi0 (= 1.20210430-1); however:
  Package libraspberrypi0 is not configured yet.

dpkg: error processing package libraspberrypi-bin (--configure):
 dependency problems - leaving unconfigured
dpkg: dependency problems prevent configuration of libraspberrypi-dev:
 libraspberrypi-dev depends on libraspberrypi0 (= 1.20210430-1); however:
  Package libraspberrypi0 is not configured yet.

dpkg: error processing package libraspberrypi-dev (--configure):
 dependency problems - leaving unconfigured
Errors were encountered while processing:
 raspberrypi-kernel
 raspberrypi-bootloader
 libraspberrypi0
 libraspberrypi-bin
 libraspberrypi-dev
E: Sub-process /usr/bin/dpkg returned an error code (1)
```

After wasting far too much time trying to debug this, I found that there was an easy solution: simply remount `/boot`.

```
> $ sudo umount /boot
> $ sudo mount /boot
```

Now, I don't know what the exact root cause is, but it's likely something to do with the fact that `/boot` is mounted as vfat and for whatever reason there is some kind of lock or similar that happens after you've run the device for some time.

In any case, hopefully this saves others the agony of trying to resolve this.
