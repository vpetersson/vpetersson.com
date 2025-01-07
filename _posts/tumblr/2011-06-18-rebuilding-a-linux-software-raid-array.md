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

```bash
cat /proc/mdstat
```

You can also get more details by running:

```bash
mdadm --detail /dev/mdX
```

Next, check your logs to see what drive failed:

```bash
cat /var/log/messages | grep -e "/dev/hd" -e "/dev/sd"
```

You can also get more details about your drive by running:

```bash
hdparm -i /dev/sdX
```

Once you've identified the failed drive and replaced it with a new one, you need to copy the partition table from the working drive to the new drive:

```bash
sfdisk -d /dev/sdY | sfdisk /dev/sdX
```

With the partition table in place, you can now add the drive back to the array:

```bash
mdadm /dev/mdZ -a /dev/sdX1
```

You can now monitor the rebuild process by running:

```bash
cat /proc/mdstat
```
