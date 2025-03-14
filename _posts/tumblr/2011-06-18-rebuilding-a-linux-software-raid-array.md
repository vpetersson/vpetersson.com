---
layout: post
title: Rebuilding a Linux software RAID array
date: '2011-06-18T19:49:02+03:00'
tags:
- Linux
- Ubuntu
redirect_from: /post/92729947349/rebuilding-a-linux-software-raid-array
---

The process is pretty straight forward, and I’m writing this as a ‘Note-to-self’ for future references than anything else. If anyone else find it useful, that’s great.

### Identify the broken drive

Start by identifying the device as the system know it (ie. /dev/sdX or /dev/hdX). The following commands should provide you with the information:

    cat /proc/mdstat

    mdadm --detail /dev/mdX

    cat /var/log/messages | grep -e "/dev/hd" -e "/dev/sd"

Once you’ve identified the drive, you want to know something more about this drive, as /dev/sdX doesn’t really tell us how the drive looks like. In my case, I have three identical drives, so the following command didn’t help me much, but maybe it does for you.

    hdparm -i /dev/sdX

That should give you both the model, brand and in some cases even the serial number. Hence this should be plenty to identify the drive physically.

### Replace the drive

Not much to be said here. I assume you already know this, but you need a drive of equal size or larger.

### Partition the new drive

If your system boot up in degraded mode, then just boot up your system. If not, boot it off of a Live CD (I used Ubuntu’s LiveCD in ‘Rescue mode’).

Once you’ve made it to a console, the first thing we need to do is to partition the new hard drive. The easiest way to do this is to use sfdisk and use one of the existing disks as the template.

    sfdisk -d /dev/sdY | sfdisk /dev/sdX

(where sdY is a working drive in the array, and sdX is your new drive)

### Rebuilding the array

The final step is to add the new drive to the array. Doing this is surprisingly easy. Just type the following command:

    mdadm /dev/mdZ -a /dev/sdX1

(assuming you want to add the partition sdX1 to the RAID array mdZ)

Of that went fine, the system will now automatically rebuild the array. You can monitor the status by running the following command:

    cat /proc/mdstat
