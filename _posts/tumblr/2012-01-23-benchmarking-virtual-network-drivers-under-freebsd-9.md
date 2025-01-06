---
layout: post
title: Benchmarking (virtual) network drivers under FreeBSD 9
date: '2012-01-23T23:02:32+02:00'
tags:
- CloudSigma
- FreeBSD
- KVM
- QEMU
- VirtIO
redirect_from: /post/92729955009/benchmarking-virtual-network-drivers-under-freebsd-9
---
With the launch of FreeBSD 9, I was curious to learn how the VirtIO driver performed. I’ve seen a significant boost in disk performance, but how about the network driver?

Luckily, that’s rather easy to find the answer to. I spun up two FreeBSD 9 nodes on [CloudSigma](http://cloudsigma.com/) and configured them with VirIO (just like in [this guide](http://viktorpetersson.com/2012/01/16/how-to-upgrade-freebsd-8-2-to-freebsd-9-0-with-virtio/)) and a private network. Once they were up and running, I installed [Iperf](http://sourceforge.net/projects/iperf/) and started testing away.

I had three different network drivers that I wanted to benchmark:

* Intel PRO/1000 (Intel 82540EM chipset)
* RealTek RTL8139
* VirtIO (QEMU/KVM)

One would of course assume that the VirtIO driver would outperform the others, but I wanted to see if that assumption was true, and if so, by how much.

The FreeBSD virtual machines I used had 2GHz CPU, and 2GB of RAM. They also both used a VirtIO block-device as storage.

The Iperf command I used on the server was:

    iperf -s

and then on the client:

    iperf -i 1 -t 30 -c TheOtherNode

So what were the findings? As you can see below, the VirtIO-driver performed better than all other drivers across the board.

\[easychart type=“vertbar” height=“400” title=“Throughput in MBits/sec” groupnames=“VirtIO, Intel PRO/1000, RealTek RTL8139” valuenames=“Average, Median, Min, Max” group1values=“256.24,255.00,165.00,328.00” group2values=“209.03,209.00,197.00,215.00” group3values=“186.34,184.00,102.00,259.00”\]

It should be said that the benchmarks I did only benchmarked traffic in one direction. Another thing that I didn’t capture in these tests were CPU usage. That would have been interesting to see, and I suspect that the VirtIO would require lest CPU power (at the very least on the host).

While I performed these benchmarks on CloudSigma’s architecture, since they are running KVM/Qemu, they should be a good indicator of general performance under KVM/Qemu.

If you found this interesting, you’ll probably also like the article [Benchmarking and tuning FreeBSD’s VirtIO network driver](http://viktorpetersson.com/2012/01/24/benchmarking-and-tuning-freebsds-virtio-network-driver/).
