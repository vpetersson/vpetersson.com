---
layout: post
title: Comparing MongoDB write-performance on CentOS, FreeBSD and Ubuntu
date: '2012-02-13T21:20:07+02:00'
tags:
- CentOS
- FreeBSD
- MongoDB
- Ubuntu
permalink: /post/92729960064/comparing-mongodb-write-performance-on-centos-freebsd-an
---
Recently I wrote a post titled ‘[Notes on MongoDB, GridFS, sharding and deploying in the cloud](http://viktorpetersson.com/2012/01/29/notes-on-mongodb-gridfs-and-sharding-in-the-cloud/).’ I talked about various aspects of running MongoDB and how to scale it. One thing we really didn’t take into consideration was if MongoDB performed differently on different operating systems. I naively assumed that it would perform relatively similar. That was a very incorrect assumption. Here are my findings when I tested the write-performance.

As it turns out, MongoDB performs very differently on CentOS 6.2, FreeBSD 9.0 and Ubuntu 10.04. This is at least true virtualized. I tried to set up the nodes as similar as possible — they all had 2GHz CPU, 2GB RAM and used VirtIO both for disk and network. All nodes also ran MongoDB 2.0.2.

To test the performance, I set up a FreeBSD 9.0 machine (with the same specifications). I then created a 5GB file with ‘dd’ and copied it into MongoDB on the various nodes using ‘mongofiles.’ I also made sure to wipe MongoDB’s database before I started to ensure similar conditions.

For FreeBSD, I installed MongoDB from ports, and for CentOS and Ubuntu I used 10gen’s MongoDB binaries. The data was copied over a private network interface. I copied the data five times to each server (“mongofiles -hMyHost -l file put fileN”) and recorded the time for each run using the ‘time’-command. The data below is simply (5120MB)/(average of real time in seconds).  
  
The result was surprising to say the least.

\[easychart type=“vertbar” height=“400” title=“MongoDB write-speed in MB/sec” groupnames=“FreeBSD 9.0, Ubuntu 10.04, CentOS 6.2” valuenames=“” group1values=“14.36” group2values=“27.25” group3values =“21.19”\]

Ubuntu is almost 2x as fast as FreeBSD! I didn’t see that one coming.

I’m not really sure why the difference is this great. I also think the fact that CentOS and Ubuntu used 10gen’s own build, and it might have some optimizations. Another thing that surprises me was the different between Ubuntu and CentOS, as they’re both using 10gen’s own binaries.

It should also be mentioned that this test was performed in a public cloud, and the load from other systems could have impacted the performance. Yet, I ran a few tests a few days earlier, and came up with similar numbers.

**Update:** I’ve been in touch with Ben Becker over at 10gen and he said that they’re not doing anything special with their binaries. They’re build in a VM with code fetched from the Github-repository without any changes. Hence, this difference is most likely explained by a less mature/optimized Virtio-driver in FreeBSD.
