---
layout: post
title: Setting up a redundant NAS with HAST and CARP
date: '2010-09-27T13:53:42+03:00'
tags:
- CARP
- FreeBSD
- HAST
- NAS
- NFS
- Samba
permalink: /post/92729925214/setting-up-a-redundant-nas-with-hast-with-carp
---
One of the coolest new features in FreeBSD is [HAST](http://wiki.freebsd.org/HAST) (Highly Available Storage). In simple terms, it can be described as RAID1 (mirror) over TCP/IP (similar to DRBD on Linux, but native). You can simply have two physical nodes replicate data over the network. If you throw in [CARP](http://www.freebsd.org/doc/handbook/carp.html) (Common Address Redundancy Protocol) to the mix, you can create a very robust storage system on commodity hardware with automatic failover.

After reading trough the official HAST wiki, I decided that the approach outlined there wasn’t the ideal approach for us. They use UCARP, which is a userland implementation of CARP. I prefer to use the real deal, as it is known to be extremely robust. The only downside with using CARP instead of UCARP is that it requires that you recompile the kernel.

In order to get this working, you need two FreeBSD 8.1 machines connected with gigabit ethernet (at least gigabit is preferred) and one spare partition or disk on each machine (preferably same size).

Here are the steps:

*   Recompile the kernel with CARP-support on both nodes
*   Set up CARP
*   Configure and set up HAST
*   Configure the failover

### Recompile the kernel

I’m going to run trough this process real quick. You can find more details in the official documentation [here](http://www.freebsd.org/doc/handbook/kernelconfig-building.html).

**Install CSVup**

cd /usr/ports/net/cvsup-without-gui
make install

Edit the CSVup config-file (/usr/share/examples/cvsup/stable-supfile)

*   Add a mirror close to the servers from [here](http://www.freebsd.org/doc/en/books/handbook/cvsup.html).
*   Change “*default release=cvs tag=” to your version of FreeBSD (eg. RELENG\_8\_1).

Update/retrieve the source:

	cvsup -L 2 /usr/share/examples/cvsup/stable-supfile

Configure the kernel. In this case we use an AMD64 CPU, but you can replace that with i386 if that’s what you have:

	cd /usr/src/sys/amd64/conf
	mkdir /root/kernels/
	cp GENERIC /root/kernels/MYKERNEL   
	ln -s /root/kernels/MYKERNEL
	joe MYKERNEL

To enable CARP, add the following

	\# CARP
	device carp

When done configuring, build and install the kernel.

	cd /usr/src
	make buildkernel KERNCONF=MYKERNEL
	make installkernel KERNCONF=MYKERNEL

If everything went fine, reboot your system into the new kernel

	shutdown -r now

### Set up CARP

With the CARP kernel module installed, setting up CARP is super easy. All you need to do to add two lines in rc.conf on each node.

We will create a virtual IP address (192.168.10.10) that automatically points to the primary node (or secondary node if the primary is down). We use the password ‘MyPassword’ for the session. The primary node has an advskew value set to 10 and the secondary node to 20. CARP will automatically use the node with the lowest advskew as the primary node.

On the primary node, add this to /etc/rc.conf:

	cloned_interfaces="carp0"
	ifconfig_carp0="vhid 1 pass MyPassword advskew 10 192.168.10.10 netmask 255.255.0.0"
	hastd_enable="YES"

And then run the following (the preempt makes the primary node the default primary):

	ifconfig carp0 create
	sysctl -w net.inet.carp.preempt=1
	echo -e "\\nnet.inet.carp.preempt=1" >> /etc/sysctl.conf

On the secondary node, add this to /etc/rc.conf:

	cloned_interfaces="carp0"
	ifconfig_carp0="vhid 1 pass MyPassword advskew 20 192.168.10.10 netmask 255.255.0.0"
	hastd_enable="YES"

And run:

	ifconfig carp0 create

if you run ‘ifconfig carp0′ on either node, you will see if it is the primary or secondary node. Here’s from my secondary node.

	carp0: flags=49 metric 0 mtu 1500
	inet 192.168.10.10 netmask 0xffff0000 
	carp: BACKUP vhid 1 advbase 1 advskew 20 

You should also be able to ping 192.168.10.10 from a different host and have the primary node respond to the ping. If you restart the primary node, the secondary node should automatically be promoted to the primary node (eg. you can ping 192.168.10.10 from a different host and only lose one or two packages when you reboot the primary node).

### Configure and set up HAST

Configuring HAST is also pretty straight forward. In my case, I have two nodes: s1 and s2. They both have a separate disk (ad6) that I will dedicate to HAST. s1 has the IP address 192.168.10.11 and s2 192.168.10.12. Also make sure that you have these hosts added in /etc/hosts (or in your local DNS). As you can see in my hast.conf, I decided to call my HAST pool ‘hast0′.

Now create the file /etc/hast.conf with the following on both nodes:

	resource hast0 {
		on s1 {
			local /dev/ad6
			remote 192.168.10.12
		}
		on s2 {
				local /dev/ad6
			remote 192.168.10.11
		}
	}

Once you’ve created the file on both nodes, you need to run the following on each node (replace hast0 if you named it something else in hast.conf):

	hastctl create hast0
	hastd

Now move over to your primary node, and run the following command:

	hastctl role primary hast0

On the secondary node, run the following command:

	hastctl role secondary hast0

Verify the result by running the following on each node:

	hastctl status hast0

Pay attention to the ‘status’ line. It should say ‘complete’ on both sides. If it says ‘degraded,’ you’ve done something wrong.

Lastly, we need to create a filesystem for HAST. On the primary node, run:

	newfs -U /dev/hast/hast0

Depending on the size of your disk/partition, this may take a few minutes. Once it is done, you should be able to mount your HAST pool with something like this:

	mkdir /mnt/hast0
	mount /dev/hast/hast0 /mnt/hast0

It is also likely that you will see that ‘hastd’ will consume 10-20% of your CPU on both nodes as it replicates the data across the systems for the initial sync. You know that it has replicated the data completely when ‘hastctl status’ on the primary node reports 0 bytes of ‘dirty’. Again, depending on the size of your disk/partition, this can take a long time (perhaps hours if you have a large drive). I suggest you do not move forward in this guide until you have your disks completely in sync.

### Configure the failover

Now we need to configure HAST and CARP to work together. What we want to accomplish is if the primary node goes down, the secondary node should take over seamlessly. To do this, we will use ‘devd.’ We will use the carp0 link up and down status as the trigger.

Open /etc/devd.conf and add the following on both nodes:

	notify 30 {
		match "system"          "IFNET";
		match "subsystem"       "carp0";
		match "type"            "LINK_UP";
		action "/usr/local/sbin/carp-hast-switch master";
	};

	notify 30 {
		match "system"          "IFNET";
		match "subsystem"       "carp0";
		match "type"            "LINK_DOWN";
		action "/usr/local/sbin/carp-hast-switch slave";
	};

When the link goes up or down, we call on the script carp-hast-switch. You can find the script [here](http://viktorpetersson.com/upload/carp-hast-switch). The only thing you should need to modify is the ‘resources’-line.

Here are the commands for fetching the file, if you’re lazy:

	wget [http://viktorpetersson.com/upload/carp-hast-switch](http://viktorpetersson.com/upload/carp-hast-switch) -O /usr/local/sbin/carp-hast-switch
	chmod +x /usr/local/sbin/carp-hast-switch

When you’ve added the dev.d configs, restart the devd demon on both nodes:

	/etc/rc.d/devd restart

Here’s what the script does when a node becomes master (or primary):

*   Promotes itself to primary in to HAST
*   Mount the HAST disk (eg. /mnt/hast0)

Here’s what the script does when it becomes slave (or secondary)

*   Umounts the HAST disk
*   Degrades itself to secondary in HAST

That’s it. You should now be able to restart the primary node, and the secondary node should automatically be promoted to the primary node. You can now configure your two nodes to share the HAST disk (/mnt/hast0) using Samba or NFS with the shared IP address.

**Credits**: [Michael W. Lucas](http://blather.michaelwlucas.com) for the HAST master/slave script.
