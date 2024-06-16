---
layout: post
title: 'Install Ubuntu Core 18/22 on Proxmox'
date: '2019-10-03T13:00:00+01:00'
tags:
- proxmox
- linux
- devops
- note-to-self
---

Today I was trying to get Ubuntu Core 18/22 working on Proxmox. Given that it is a KVM based tool, it's fairly straight-forward, but took me a bit of time go get working (thus this write-up).

There are good [installation instruction](https://ubuntu.com/download/iot/kvm) for how to install Ubuntu Core on KVM, but I needed to do a little bit of work got it running on Proxmox.

Before we begin, go ahead and create a VM in Proxmox's interface. Make sure to do the following selections:

 * Select 'Do not use any media' for the installation drive
 * Set the BIOS to 'OVMF (UEFI)'
 * Remove the default disk that is added (we'll import one later)
 * Set the CPU/RAM configuration as per your desired, but one core and 512MB RAM should be plenty

Once done, take note of the VM ID (as we'll need that below) and what pool (you can use `pvesm status` to list your pools) you want to use. With this information, it's now time to SSH into the server and download the disk image and import it Proxmox.

```
$ wget http://cdimage.ubuntu.com/ubuntu-core/18/stable/current/ubuntu-core-18-amd64.img.xz
$ unxz ubuntu-core-18-amd64.img.xz
$ qm importdisk $VM-ID ubuntu-core-18-amd64.img $DRIVE-POOL
$ rm ubuntu-core-18-amd64.img
```

Assuming everything went well, the drive should now be showing up as 'Unused Disk 0' under the VM. Attach the drive as a `virtio` (to get the best performance).

Before booting the VM, go to 'Options' -> 'Boot Order' to ensure that the harddrive is set to 'enabled' and has a boot order.

You may also want go to 'Hardware' and add a 'TPM State' (v2) if you want to also use Secure Boot (and possibly even Full Disk Encryption).

With this done, you should now be able to boot up your Ubuntu Core VM and be on your way.
