---
layout: post
title: Install Ubuntu Core 18 on Proxmox
date: '2018-10-03T13:00:00+01:00'
tags:
- proxmox
- linux
- devops
- note-to-self
---

Today I was trying to get Ubuntu Core 18 working on Proxmox. Given that it is a KVM based tool, it's fairly straight-forward, but took me a bit of time go get working (thus this write-up).

There are good [installation instruction](https://ubuntu.com/download/iot/kvm) for how to install Ubuntu Core on KVM, but I needed to do a little bit of work got it running on Proxmox.

Before we begin, go ahead and create a VM in Proxmox's interface. Make sure to not select 'Do not use any media' for the installation drive and add a hard drive as usual (we'll delete it later). One core and 512MB RAM should be plenty.

Once done, take note of the VM ID (as we'll need that below) and what pool pool (e.g. 'local') you want to use. With this information, it's now time to SSH into the server and download the disk image and import it Proxmox.

```
$ wget http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-amd64.img.xz
$ unxz ubuntu-core-18-amd64.img.xz
$ qm importdisk $VM-ID ubuntu-core-18-amd64.img $DRIVE-POOL
$ rm ubuntu-core-18-amd64.img
```

Assuming everything went well, the drive should now be showing up as 'Unused Disk 0' under the VM.

Select the drive created by the wizard and press 'Detach' and 'Attach' the new one.

Lastly, you can select the drive old drive (which should now show up as an "Unused Disk") and press Remove.

With this done, you should now be able to boot up your Ubuntu Core VM and be on your way.
