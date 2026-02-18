---
slug: time-machine-on-mountain-lion
title: Time Machine on Mountain Lion
date: '2012-08-15T08:34:43+03:00'
tags:
- Apple
- Mac OS X
- Time Machine
aliases: /post/92729966909/time-machine-on-mountain-lion
---

![](https://vpetersson.com/wp-content/uploads/2012/08/Time-Machine.png "Time Machine")

I’m not sure if I’m the only one having issues with Time Machine, but it has been completely broken for me since I upgraded to Mountain Lion. As you can see above, Time Machine basically freezes and reports outrageous ETA statistic.

What is strange is that I did a fresh install. I do have FileVault2 activated on both the Time Machine-drive (which is brand new) and my internal drive. That should work fine, as I used the same setup on Lion.

At this point, I’m just waiting for 10.8.1 to be released (the developer preview is already out) and hoping that it will solve the issue. Other than that I’m out of ideas. I’ve formatted the Time Machine drive a few times just to ensure that it wasn’t a filesystem issue. Heck, I even ‘securely’ formatted it and wrote zeros all over the drive just to be safe, but still no change.

The one other thing that I’m thinking may be related is that the external drive used is a USB3-drive. Perhaps that is causing trouble for my MacBook Pro (MacBookPro8,2).

**Update**: Looks like i’m [not alone](https://discussions.apple.com/thread/4145494?start=60&tstart=0) with having this issue.

**Update 2**: After struggling with this annoying issue for a few weeks now, I decided to try using my NAS as the Time Machine-target. Since you can encrypt your remote backups, I thought I’d give it a shot. While it started out fine and copied about 1.5GB of data, it then stalled. I guess this proves that there weren’t anything wrong with my USB-drive and that the issue is with Time Machine’s engine.

**Update 3**: After a reboot and running ‘Repair disk permission’ (in ‘Disk Utility’) on the system drive, I was able to successfully backup my drive on the NAS. I hate to not be able to share a solution to all the other people who were having the issue, but it seems to work for me. As much as I’d love to see if it also works with the USB-drive, I do not want to jeopardize anything right now.

**Update 4:**: It was probably unfair to blame this on Apple. It turns out that my SSD was giving up on me. Unlike magnetic drives, there was no physical way to tell. No clicking noises, and no obvious write errors. Instead the disk appears to have failed silently and caused Spotlight’s indexing to fail. That in turn caused Time Machine to fail. I’ve now switch out the drive for a brand new one, and the issues appears to have gone away.
