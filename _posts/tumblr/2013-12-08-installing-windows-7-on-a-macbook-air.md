---
layout: post
title: Installing Windows 7 on a MacBook Air
date: '2013-12-08T12:59:06+02:00'
tags:
- Mac OS X
- NotesToSelf
- Windows
redirect_from: /post/92718706354/installing-windows-7-on-a-macbook-air
---
It’s blasphemy, I know. Why would anyone in their right state of mind do such thing?

Unfortunately, people outside the tech-world, and ISV who provides them with software, are still stuck with Windows (due to ignorance or lack of choice).

If you want to equip someone in that world with a great and light laptop, a MacBook Air is a pretty good choice. It’s affordable, and since you will be installing a **pure** (i.e. non vendor/bloatware infected version) of Windows, it makes a pretty good Windows machine (an oxymoron, I know).  
  
In the process of preparing this MacBook Air, I was pretty close to going insane. To save you the agony I had to go through, here are the steps you need to take.

* Make sure you have the following available: A Windows 7 installation DVD, a USB DVD drive, and a 8GB USB stick.
* Insert the 32 or 64 bit version of Windows 7 into the USB DVD.
* Fire up Disk Utility. Select the volume under the DVD drive. Click ‘New Image’ -> Select ‘DVD / CD Master’ as the image format and save it to disk.
* Once the disk has been created, you need to convert it to an ISO image. This can be done using the Terminal by executing this command ‘hdiutil makehybrid -iso -joliet -o win7.iso win7.cdr’ (assuming you named the master image ‘win7.cdr’ and you’re in the directory you saved the image.
* This next step is **very important**. You need to download [Caffeine](http://lightheadsw.com/caffeine/). This will prevent your machine from falling asleep during the Boot Camp Assistant run, which will take a while. Make sure you start Caffeine and that it is activated. If you fail to do this, your installation is most likely going to fail. You could of course disable all power saving features in OS X, but I find just running Caffeine faster.
* Launch Disk Utility again and make sure you don’t have a Windows partition created from a prior installation attempt. If you do, make sure to delete it before continuing. If not, Boot Camp Assistant will behave differently.
* Insert the USB stick **directly** into the laptop (i.e. don’t use a USB hub, as this can confuse the boot process later). Some people at various forum claims that it must be in the left USB port, but I’m not sure if that is true or not.
* Launch Boot Camp Assistant. You need to make sure that you both create the USB drive **and** launch the installer. If not, the installation is most likely going to fail. You also need to select the ISO image we created earlier when the tool asks for the disk image.
* Assuming you don’t run into any hiccups, you should be taken directly into the Windows installation.
* After the installation, 12 hours of downloading security updates and 32 reboots, you should be up and running with your brand new Windows 7 machine.

These notes will hopefully save you a bunch of hours, which I had to waste while learning these caveats.
