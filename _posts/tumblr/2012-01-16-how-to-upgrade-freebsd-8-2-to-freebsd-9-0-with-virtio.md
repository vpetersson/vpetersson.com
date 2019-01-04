---
layout: post
title: How to upgrade FreeBSD 8.2 to FreeBSD 9.0 with Virtio
date: '2012-01-16T18:23:43+02:00'
tags:
- FreeBSD
- KVM
- QEMU
- VirtIO
- Virtualization
redirect_from: /post/92729954479/how-to-upgrade-freebsd-8-2-to-freebsd-9-0-with-virtio
---
Some time ago, I wrote about [how to use Virtio with FreeBSD 8.2](/2011/10/20/how-to-use-virtio-on-freebsd-8-2.html). As I pointed out in the article, the performance was not nearly as good in FreeBSD 8.2 as it was in 9.0-RC1. Hence I wanted to get all my nodes over to 9.0 as soon as possible to take use of the massive boost in I/O performance.

In this article I will walk you through the process of updating an existing system from FreeBSD 8.2 (without Virtio) to 9.0 with Virtio.

If you’re just curious on how to get Virtio working on a fresh FreeBSD 9.0 installation, skip to [Step 2](#virtio).

Step 1: The upgrade
-------------------

Let’s get right to it. Here’s the first step in the upgrade process:

    freebsd-update upgrade -r 9.0-RELEASE

Once all files have been fetched, you will be asked a number of questions about merging config-files. They all seemed reasonable to me, so I just answered ‘y’ to all of them, but it might differ for you. Make sure you **read** the diff before accepting it.

If you get the following error:

The update metadata is correctly signed, but failed an integrity check.
Cowardly refusing to proceed any further.

Then simply patch your freebsd-update using the following command ([source](http://lists.freebsd.org/pipermail/freebsd-stable/2011-October/064321.html)):

    sed -i '' -e 's/=_/=%@_/' /usr/sbin/freebsd-update

and then re-run the upgrade command again.

If that went fine, it’s time to update the actual system. To do that, run:

    freebsd-update install

Onde the update is done, reboot your system:

    shutdown -r now

When it comes back up, make sure you run the install-again to install again to intall the userland updates:

    freebsd-update install

Once you’ve run this, you’ll get the message:

Completing this upgrade requires removing old shared object files.

Please rebuild all installed 3rd party software (e.g., programs
installed from the ports tree) and then run 
`/usr/sbin/freebsd-update install`  again to 
finish installing updates.

This is of course a massive pain in the butt, but you need to do this nonetheless. Depending on how many packages from ports you have installed, this may take everything from a few minutes to a **long** time.

The easiest way to do this is to run portupgrade (if you don’t have portupgrade, install it from `sysutils/portupgrade`):

    rm /var/db/pkg/pkgdb.db && pkgdb -Ffuv && portupgrade -afp

I added the ‘p’-flag, as this allows you to run ‘portupgrade -afP’ on other nodes (assuming you have a shared ports-tree) and just install the packages without having to re-compile them.

Finally, when you’ve done this, you can run (for the last time):

    freebsd-update install

<a id="virtio"></a>

Step 2: Installing Virtio
-------------------------

Nowadays, Virtio is available in ports. That’s of course great, as that reduces the burdan of installing it. All you need to do is to run:

    cd /usr/ports/emulators/virtio-kmod && make clean install

Once the kernel-module is installed, add the following to /boot/loader.conf:

    virtio_load="YES"
    virtio\_pci\_load="YES"
    virtio\_blk\_load="YES"
    if\_vtnet\_load="YES"
    virtio\_balloon\_load="YES"

Next, we need to tell the system to actually use Virtio. The above commands assume that you are using ‘emX’ as your network-interface and /dev/daX or /dev/adX as your harddrive. It also that you’re using /etc/pf.conf as your firewall config, and that you have coded it to use the NIC’s name and not just IP-address. If you’re not using PF or use a different setup, simply skip the last command.

    cp /etc/fstab /etc/fstab.bak && cat /etc/fstab.bak | perl -pe "s/ad/vtbd/g; s/da/vtbd/g;" > /etc/fstab
    cp /etc/rc.conf /etc/rc.conf.bak && cat /etc/rc.conf.bak | perl -pe "s/em/vtnet/g;" > /etc/rc.conf
    cp /etc/pf.conf /etc/pf.conf.bak && cat /etc/pf.conf.bak | perl -pe "s/em/vtnet/g;" > /etc/pf.conf

Now power off the system to make the changes to the host:

    shutdown -p now

When the system stops, update all network drivers to Virtio and change the primary disk to block-driver.

You should now be able to boot into the new system with Virtio and enjoy a lot better (and more reliable) speed.
