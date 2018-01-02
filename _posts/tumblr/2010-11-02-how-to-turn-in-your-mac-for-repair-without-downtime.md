---
layout: post
title: How to turn in your Mac for repair without downtime.
date: '2010-11-02T18:09:56+02:00'
tags:
- Mac OS X
permalink: /post/92729930569/how-to-turn-in-your-mac-for-repair-without-downtime
---
Let’s face it — all computers fail at one time or another. In my experience Apple computers break far less than PCs, and when they fail, Apple provide fast and great repairs. If you live in a country with Apple Stores, it’s even easier. When a PC breaks, you’re usually out of luck. Long hours on hold with some Indian call center awaits you and if you are able to convince them that your broken computer should be covered by the warranty, you are likely to spend weeks, if not months, without your computer.

This article assumes that you do own a Mac, and that you do need to hand it over to Apple for a repair. This can take anywhere from a few days to a week or two, depending on what’s wrong with it. If you’re like me, the mere thought of being without your computer for more than a few hours is enough to case nightmares and, perhaps more importantly, a significant loss of productivity.

Last week I was faced with this problem. After speaking with Apple on the phone, they said the repair would probably take at least a week, as I haven’t turned in my laptop for repair since I bought it, and just kept a list of things that needed to be repaired.

After spending some time thinking how I could resolve this, I came up with a surprisingly effective solution that gave me literally no downtime. This is what you need:

*   A spare Mac

Doesn’t matter if it is a desktop or laptop, as long as it is the same architecture (Intel/PowerPC). I used a Mac Mini.

*   An empty USB disk of the size, or greater than, the drive in your computer

  
Now do the following:

*   Shutdown your computer
*   Boot it on your Mac OS installation disk
*   Launch Disk Utility within the installer
*   Format the USB disk with one ‘Mac OS Extended (Journaled)’-partition of the same size as your internal drive.
*   Make sure that the partition scheme is set to ‘GUID’
*   Go to the ‘Restore’-tab
*   Drag your regular boot-partition into the ‘Source’-field
*   Drag the newly created partition into the ‘Destination’-field
*   Press ‘Restore’

This will clone the entire disk of your computer to the USB-drive. This process will probably take 10h+, so it is good thing to do before you leave the office for the night.

Once the process is complete shut down the computer. Turn off your spare Mac and plug in the USB-drive. Turn on the spare Mac and hold down the ‘Alt’/’Option’-key. This will bring up a boot menu. You should now see the partition you created on your USB-drive. Select it.

Once OS X boots up, you will notice that you have your entire system running. All apps and settings are there. You can just continue your work. You can now boot up your the Mac you are going turn in for repair on the Mac OS installation, wipe the disks, and perform a clean installation.

Voila! You now have a clean Mac that you can turn in for repair without having to worry about your data being read by some technician, while you can continue your work on the spare Mac. When you get your computer back from repair, you can just repeat the process above in reverse, and you will be up and running on your old computer again.
