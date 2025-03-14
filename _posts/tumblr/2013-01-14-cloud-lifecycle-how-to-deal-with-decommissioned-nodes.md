---
layout: post
title: 'Cloud lifecycle: How to deal with decommissioned nodes'
date: '2013-01-14T12:54:48+02:00'
tags:
- Security
- Virtualization
redirect_from: /post/92729973189/cloud-lifecycle-how-to-deal-with-decommissioned-nodes
---

There’s no doubt that virtualization and the cloud is here to stay. So you migrated your entire architecture to the cloud and everyone is happy. Eventually, you’ll come to a point where you start decommission servers.

If this was an on-premise server, all you had to do was to powered it off and perhaps put it to use elsewhere (or if virtualized, simply delete it). In the cloud however, it’s tempting to do the same.

What people don’t think about however is that most cloud vendors use regular magnetic disks. This means that when you delete a virtual drive, it will be provisioned to someone else. Normally, the first thing the next person who gets provisioned your old disk blocks (or parts of it) would do is to format it and fill it with data.

**However**, if this person is a malicious user, s/he could restore what was written to those disk blocks, just as s/he could with a magnetic drive that has been formatted.

Therefore, before I decommission any drives in the cloud, this is what I do:

- Power off the system
- Change the boot device to a Live CD (most linux-distributions will do)
- Run [shred](http://manpages.ubuntu.com/manpages/intrepid/man1/shred.1.html) on the device
- Power off the system and delete the drive

While shredding the drive will take a fair amount of time, we know that even if a malicious user is provisioned the same disk blocks, they won’t find any of your data.
