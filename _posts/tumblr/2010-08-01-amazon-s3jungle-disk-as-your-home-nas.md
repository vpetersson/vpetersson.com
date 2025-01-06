---
layout: post
title: Amazon S3/Jungle Disk as your home NAS?
date: '2010-08-01T13:58:11+03:00'
tags:
- Jungle Disk
- S3
- Samba
redirect_from: /post/92729920124/amazon-s3jungle-disk-as-your-home-nas
---
This idea hit me this morning. Assuming you have a decent connection at home (not ADSL or Cable that is), [Amazon S3](http://aws.amazon.com/s3/) (or [Jungle Disk](https://www.jungledisk.com)) makes a pretty nice back-bone for a home NAS. It is fairly cheap and you will no longer worry about growing out of your array or failing disks. Yes, I reckon that if you store your data without encryption (even in a private bucket), it may leak out. However, as long as you’re not storing top-secret government files, I think you’ll be fine.

While you could just use something like [Transmit](http://panic.com/transmit/) on your Mac to mount the S3 share locally, it’s not ideal for home network if you have multiple machines. Instead, we can set up a simple server (virtual or physical) to act as a gateway to the remote storage.

Here’s what I’m thinking:

* Install Ubuntu (or your favorite Linux distribution) on a server (virtual or physical)
* Install [s3fs](http://code.google.com/p/s3fs/) if you’re S3 or the Jungle Disk for Linux.

If you’re using S3, create a private bucket. I’m not sure how that works on Jungle Disk.

* Mount the remote drive to something like /shared
* Install and configure Samba to share /shared to the local network

Simple as that. You can now access the S3/Jungle Disk share as you would with a regular physic NAS. Granted, I haven’t tried this myself, but it should work in theory at least. The only problem I can foresee is the latency issue. Also, you can obviously not expect LAN speed to the storage back-end, but if you have a decent connection you should be able to get at least a few MB/sec. That should be sufficient for browsing pictures and even stream a (non HD) movie.

As a bonus, you can just copy the virtual machine you set up above to another network and have access to the same files from there.
