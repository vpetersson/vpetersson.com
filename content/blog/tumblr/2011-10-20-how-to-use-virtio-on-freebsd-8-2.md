---
slug: how-to-use-virtio-on-freebsd-8-2
title: How to use Virtio on FreeBSD 8.2+
date: '2011-10-20T19:08:09+03:00'
tags:
- CloudSigma
- FreeBSD
- KVM
- QEMU
- VirtIO
- Virtualization
aliases: /post/92729951304/how-to-use-virtio-on-freebsd-8-2
---

In the past few years, virtualization has been the big topic everybody keeps talking about. There are good reasons for that, but one thing that really annoys me as a hardcore FreeBSD-fan is how poorly FreeBSD performs virtualized.

For some time, the Linux-community have been using the [Virtio](http://wiki.libvirt.org/page/Virtio)-drivers to boost both I/O and network performance. Simply put, Virtio is a driver written to cut out any unnecessary emulation on the host and as a result both reduce load from the host and improve performance.

Unfortunately the FreeBSD-community haven’t been able to utilize this, as there were no port for this. Luckily that just changed and here’s how you enable it.

Just as a disclosure, I’ve only tried the I/O driver on [CloudSigma](http://www.cloudsigma.com), and it seems to be stable both on 8.2 and 9.0-RC1. According to other [this](http://kdl.nobugware.com/post/2011/10/14/freebsd-90-guest-virtio-support-in-KVM/) post, the network driver should work too though. It should however be said that the I/O performance on 8.2 is **significantly slower** than on 9.0-RC1.

## Grab the source code

I spoke briefly about how to compile the kernel in [this](https://vpetersson.com/2010/09/27/setting-up-a-redundant-nas-with-hast-with-carp/) article, but you only need to fetch the source code. You don’t actually need to recompile the system like the article says.

## Grab the Virtio-patch

In order to grab the patch, you need to first install Subversion. Assuming you got the ports installed, installing this is easy:

    cd /usr/ports/devel/subversion
    make install

With that installed, let’s grab the actual driver/patch.

    cd /usr/src/sys/dev
    svn co [http://svn.freebsd.org/base/projects/virtio/sys/dev/virtio](http://svn.freebsd.org/base/projects/virtio/sys/dev/virtio)
    cd /usr/src/sys/modules
    svn co [http://svn.freebsd.org/base/projects/virtio/sys/modules/virtio](http://svn.freebsd.org/base/projects/virtio/sys/modules/virtio)

Assuming that went well, let’s build and install the driver.

    cd /usr/src/sys/modules/virtio
    make && make install

The final step is to activate the driver at boot. To do so, just add the following lines to /boot/loader.conf

    virtio_load="YES"
    virtio\_pci\_load="YES"
    virtio\_blk\_load="YES"
    if\_vtnet\_load="YES"
    virtio\_balloon\_load="YES"

That’s it. If you already got a Virtio-device installed, you should be able to simply reboot your machine and it should pop up. If not, you need to shut down machine entirely, add this device, and then bring it back up.

Once it comes back up, you can verify that it showed up by running

    dmesg | grep -i virtio

## Replacing your primary disk with Virtio

Once you’ve verified that the driver actually works, you might want to replace your disks with Virtio. To do that, all you really need to do is to modify your fstab. Please note that this is risky and if something fail, you won’t be able to boot your server.

Assuming are aware of the risks, here’s a command that replaces ad (IDE disks) with vtbd (Virtio-disk). If you’re using SCSI-emulation, replace ‘ad’ with ‘da’.

    cp /etc/fstab /etc/fstab.bak
    cat /etc/fstab.bak | perl -pe "s/ad/vtbd/g;" > /etc/fstab

Verify the result by manually looking in /etc/fstab. If everything looks fine, you should be able to reboot your system. Once it comes back up, it should be using Virtio.

**Credits:** [Keep Da Link](http://kdl.nobugware.com/post/2011/10/14/freebsd-90-guest-virtio-support-in-KVM/).

**Update:** I wrote a new post titled [How to upgrade FreeBSD 8.2 to FreeBSD 9.0 with Virtio](https://vpetersson.com/2012/01/16/how-to-upgrade-freebsd-8-2-to-freebsd-9-0-with-virtio/). You should really take a look at that post instead, as the steps are much easier.
