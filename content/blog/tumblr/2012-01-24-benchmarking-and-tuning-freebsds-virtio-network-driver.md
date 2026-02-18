---
slug: benchmarking-and-tuning-freebsds-virtio-network-driver
title: 'Benchmarking and tuning FreeBSD''s VirtIO network driver. '
date: '2012-01-24T20:34:54+02:00'
tags:
- CloudSigma
- FreeBSD
- KVM
- QEMU
- Virtualization
aliases: /post/92729955554/benchmarking-and-tuning-freebsds-virtio-network-driver
---

In the [previous post](https://vpetersson.com/2012/01/23/benchmarking-virtual-network-drivers-under-freebsd-9/), I benchmarked three different virtual network drivers under FreeBSD. The clear winner was, perhaps not very surprisingly, the VirtIO network driver.

In this article I will do some further benchmarking and try to optimize the driver further. Similarly to in the last post, I will use two FreeBSD 9.0 boxes with 2GB RAM and 2GHz CPU. Both nodes are set up with a private network and running in a public cloud (at CloudSigma).

As many of you might know, running tests in a public cloud is difficult. For instance, you can’t control the load other nodes puts on the host resources and network architecture. To cope with this, I ran all tests five times with a 60 second sleep in between. This of course, isn’t perfect, but it is at least better than a single test.

## The tests

For each test, I ran five different sub-tests, namely one wich each of the following TCP window sizes:

- 64K
- 128K
- 512K
- 1024K
- 1536K

The actual tests used Iperf, and ran the following command on the server:

    iperf -s -w $WINDOW

and then the following Bash-script on the client:

    #!/usr/local/bin/bash
    WINDOW=$1
    OUT=$2
    x=1
    while \[ $x -le 5 \]
    do
    	echo "Starting test $x"
    	iperf -i 1 -t 30 -w $WINDOW -c TheOtherNode >> $OUT
    	sleep 60
    	x=$(( $x + 1 ))
    done

The variable ‘$WINDOW’ is, as you might have already figured out, the TCP window size for the given test. This test gives me a total of 155 data-points for each test (31*5).

The three tuning-variables I wanted to benchmark in this tests were:

- kern.ipc.maxsockbuf
- net.inet.tcp.sendbuf_max
- net.inet.tcp.recvbuf_max

The reason I chose these variables were simply because the article [Enabling High Performance Data Transfers](http://www.psc.edu/networking/projects/tcptune/#FreeBSD) recommended that one should start there.

### Test 1

In test 1, I wanted to benchmark a vanilla FreeBSD 9 installation with the VirtIO network driver. The default values for the tuning-variables were used. These were:

    kern.ipc.maxsockbuf=2097152
    net.inet.tcp.sendbuf_max=2097152
    net.inet.tcp.recvbuf_max=2097152

\[easychart type=“vertbar” height=“400” title=“Throughput in MBits/sec” groupnames=“Average, Median, Min, Max” valuenames=“64k,128k,512k,1024k,1536k” group1values=“209.98,220.12,227.74,237.30,212.92” group2values=“180.00,200.00,216.00,234.00,200.00” group3values=“145.00,161.00,132.00,105.00,139.00” group4values=“304.00,373.00,402.00,422.00,349.00”\]

### Test 2

In test 2, I increased the kern.ipc.maxsockbuf see what impact that would have on the performance. The new settings would then be:

    kern.ipc.maxsockbuf=4000000
    net.inet.tcp.sendbuf_max=2097152
    net.inet.tcp.recvbuf_max=2097152

The change was made to both servers.

\[easychart type=“vertbar” height=“400” title=“Throughput in MBits/sec” groupnames=“Average, Median, Min, Max” valuenames=“64k,128k,512k,1024k,1536k” group1values=“217.74,164.54,163.05,163.08,145.51” group2values=“226.00,158.00,166.00,165.00,146.00” group3values=“134.00,106.00,93.30,0.20,59.80” group4values=“305.00,298.00,229.00,277.00,257.00”\]

### Test 3

The last test, I left kern.ipc.maxsockbuf set the above value, but I also increased net.inet.tcp.sendbuf\_max and net.inet.tcp.recvbuf\_max. The settings were then:

    kern.ipc.maxsockbuf=4000000
    net.inet.tcp.sendbuf_max=16777216
    net.inet.tcp.recvbuf_max=16777216

Similarly to in test 2, the change was applied to both servers.

\[easychart type=“vertbar” height=“400” title=“Throughput in MBits/sec” groupnames=“Average, Median, Min, Max” valuenames=“64k,128k,512k,1024k,1536k” group1values=“128.51,151.89,141.17,157.74,152.62” group2values=“132.00,155.00,136.00,158.00,154.00” group3values=“79.70,94.40,70.30,69.20,81.80” group4values=“191.00,241.00,233.00,230.00,234.00”\]

## Comparing the results

\[easychart type=“vertbar” height=“300” width=“350” title=“Average performance (MBits/sec)” groupnames=“Test 1, Test 2, Test 3” valuenames=“64k,128k,512k,1024k,1536k” group1values=“209.98,220.12,227.74,237.30,212.92” group2values=“217.74,164.54,163.05,163.08,145.51” group3values=“128.51,151.89,141.17,157.74,152.62”\]

So what kind of conclusion can we draw from this? I’m inclined to say nothing.

The numbers appears to hint at that the systems performs best out-of-the box. Maybe the values I tuned turned out to have very little impact in a virtual environment. Maybe the uncontrollable variables in a public cloud (eg. load from other nodes on the hardware and networking architecture) impacted the data and invalidated the data. Perhaps another explanation is that we’re pushing the capped limit upstream, and hence are unable to see any significant difference between the tests.

Since I’m by no means a TCP/IP expert, I’d be curious to learn what other people with more experience think about this test, and where I should look to push performance further.
