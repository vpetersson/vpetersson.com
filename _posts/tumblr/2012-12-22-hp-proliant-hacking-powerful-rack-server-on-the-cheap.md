---
layout: post
title: HP ProLiant-hacking. Powerful rack server on the cheap.
date: '2012-12-22T22:14:58+02:00'
tags:
- Lifehack
redirect_from: /post/92729972129/hp-proliant-hacking-powerful-rack-server-on-the-cheap
---
Rack-servers make your life easier. They allow you to stack a bunch of servers into a small area while still keeping them well organized. Unfortunately, most server-vendors know this, and will charge you an arm and a leg for them. I recently had to build up a small virtualization-farm, and I really wanted to keep all server in a rack without having to spend a fortune on servers.

Enter [HP ProLiant DL-120](http://h10010.www1.hp.com/wwpc/us/en/sm/WF06b/15351-15351-3328412-241644-3328421-5075933-5173493-5173494.html?dnr=1). It might not look too impressive, but for the price-point (I paid ~$800 each), it’s not bad 1U server. However, we haven’t started with beefing it up.

Photos of the setup can be found [here](https://plus.google.com/photos/102112347693505491575/albums/5824880631135958625?authkey=CNeWsJ6r67PABQ).  

### The extras.

The first thing you may notice is that the server ships without hard drives. HP want you to buy their ridiculously overpriced server-disks (which are basically regular SATA/SAS drives in a plastic enclosure). I opted out for this and went for regular drives (and I couldn’t find any compatible DIY plastic enclosures). Since we’re not using these enclosures, this means that we won’t be able to hotswap drives unfortunately. Personally I think that was a reasonable compromise.

It also turns out that the on-board RAID-controller is just a crappy software controller that performs poorly under Linux. To remedy these shortcomings, I added a few extra things to my shopping list:

* 4 x 4 GB RAM (I went for HP’s, as they weren’t too overpriced)
* 4 x 2TB SATA 7200 RPM drives
* 1 x Adaptec 2405
* 2 x SATA extenders (0.5m)
* Optional: USB CD/DVD reader (for installation)

With these extensions, we’re able to create a pretty beefy server with 16GB RAM and 2TB of usable storage backed with (hardware) RAID 10.

### What you’re giving up.

First and foremost, you’re giving up the ability to hotswap drives by opting out for the HP’s stock-hard drives. This also means that you won’t have any HDD leds in the front. While I would much liked that, we’re a lot of extra disk space in return. Yet, all-in-all, I’m willing to give that up to save a few hundred dollars per server.

**Putting it all together.**  
Once you have all the parts, it’s time to put it all together. It shouldn’t be too hard, but it is a bit hackish. A few things you’ll notice is that you need to put the Adaptec-card into the full-height slot, otherwise the cables won’t reach. With the Adaptec-card installed, you can connect the SATA cables to the front by following the existing cables. The built-in cable should be sufficient for the first two drives, but you need the SATA extension cables to reach drive three and four.

To install the hard drives, you first you need to remove all of the plastic placeholders in the front. Then insert the hard drives upside down. This will allow you to connect the drives to the Adaptec-card as well as power. Once installed, simply secure the drives with some tape in the front.

Installing the memory should be very straight forward.

### Initialize the RAID array.

This one took me some time to figure out. While booting up, the HP’s BIOS will display “Press any key to view Option ROM messages.” I didn’t really connect the dots here, but this is what you need to do to get to Adaptec’s BIOS.

### Wrapping up.

Now, with the RAID initialized, all you need to do is to add your USB cd/dvd drive and boot into your favorite Linux distribution, which should detect your hardware without any extra drivers.
