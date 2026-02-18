---
slug: how-to-migrate-from-qcow2raw-to-iscsi-with
title: How to migrate from qcow2/raw to iSCSI with KVM/QEMU
date: '2016-07-29T12:52:18+03:00'
tags:
- kvm
- qemu
- virtualization
- linux
aliases: /post/148144459604/how-to-migrate-from-qcow2raw-to-iscsi-with
---

I recently had to migrate a number of VMs currently running on an NFS share to an iSCSI target. During my research, I was surprised how little documentation there was around this, so I decided to whip up this quick little piece about how to do it.

Here are the steps:

- Create a new iSCSI target (one per VM/image you’re migrating). This step varies depending on your setup.
- Attach target on server (I found [virt-manager](https://virt-manager.org/) suitable for the task).
- Find the device from logs (/dev/sdc below). On Ubuntu, you will also need to install the package open-iscsi.
- Run `qemu-img convert /path/to/your/image.qcow2 -O raw /dev/sdc` (for raw images, you could simply use `dd` but to keep things consistent, I opted for `qemu-img`).
- Update the disk config in the VM definition to point to the iSCSI target.
- Boot the VM and archive the old disk image.

Voila! You should now have a VM running on iSCSI and you will likely receive better I/O performance.
