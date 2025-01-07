---
layout: post
title: Virtualization on Ubuntu 14.04 with virsh and vmbuilder
date: '2015-01-18T17:22:00+02:00'
tags:
- ubuntu
- kvm
- qemu
- vmbuilder
- virsh
- virtualization
- hypervisor
redirect_from: /post/108451140634/virtualization-on-ubuntu-1404-with-virsh-and
---
While I’ve switched most of my workloads to [Docker](https://www.docker.com), there are still some situations where you need to manage and set up Virtual Machines (VM). These days, KVM+QEMU has more or less been established as the virtualization standard, so we’ll be using that.

Setting this up on Ubuntu 14.04 (Trusty Tahr) is very straight forward. All you need to do is to run:

    sudo apt-get install qemu-kvm libvirt-bin ubuntu-vm-builder bridge-utils

Assuming everything went well, you should now be up and running and can list your VMs (there are of course none):

    $ sudo virsh list
     Id    Name                           State
    ----------------------------------------------------

If something went wrong, take a look at the [KVM installation guide](https://help.ubuntu.com/community/KVM/Installation).

If you only need Usermode Networking (i.e. no public IP), you’re done now. If you however need your VMs to be accessible from the outside, you need to set up [bridged networking](https://help.ubuntu.com/community/KVM/Networking#Bridged_Networking).

With your system up and running, let’s create a VM using `vmbuilder`:

    $ sudo vmbuilder kvm ubuntu \
        --suite trusty \
        --flavour virtual \
        --addpkg=linux-image-generic \
        --addpkg=unattended-upgrades \
        --addpkg openssh-server \
        --addpkg=acpid \
        --arch amd64 \
        --libvirt qemu:///system \
        --user ubuntu \
        --name ubuntu \
        --hostname=test \
        --pass default

_Due to [this](http://serverfault.com/questions/590114/vanilla-ubuntu-vm-builder-on-i7-aborts-aborts-with-pae/591369#591369) bug, you will need to use the “linux-image-generic” kernel instead of regular virtual one._

Creating the VM will take some time. Once it has been created you can start the VM using `virsh` with:

    virsh start test

In order to `ssh` into the server, we need to find the server IP. There are a few ways to find this, but here’s the best technique I’ve found:

    $ sudo virsh dumpxml test | grep 'mac address'
      <mac address='XX:YY:ZZ:XX:YY:ZZ'/>
    $ arp -an | grep 'XX:YY:ZZ:XX:YY:ZZ'
      ? (192.168.122.135) at XX:YY:ZZ:XX:YY:ZZ [ether] on virbr0

Next, `ssh` into the VM:

    ssh ubuntu@<the VM IP>

_The password is defined above as ‘default’_

As you probably noticed, those are a fair amount of variables we need to pass onto `virsh`. The easiest solution to get around this is to create a config file. Porting the variables above into a config file would leave us with something like this:

    [DEFAULT]
    arch = amd64
    user = ubuntu
    name = ubuntu
    pass = default
    tmpfs = -
    
    [ubuntu]
    suite = trusty
    flavour = virtual
    addpkg = openssh-server, unattended-upgrades, acpid, linux-image-generic
    
    [kvm]
    libvirt = qemu:///system

With this config file, we can create a VM by simply running:

    sudo vmbuilder kvm ubuntu -c myfile.cfg

A more complete config file, along with important hooks for re-generating SSH host keys on first boot can be found [here](https://help.ubuntu.com/community/JeOSVMBuilder#Using_configuration_files).

There’s a lot more to `virsh` and `vmbuilder`, but this should help you get started.

Caveats
-------

* In `virsh` VMs are referred to as 'domains.’ This might be a bit confusing at first.
* To stop and delete a VM in `virsh`, run `destroy test` and then `undefine test --managed-save`.
* You probably want to use the `--mem`, `--cpus` and `--rootsize` options when using `vmbuilder` (see the [man page](http://manpages.ubuntu.com/manpages/trusty/en/man1/vmbuilder.1.html)).
* Using the `--hostname` is handy when creating new VMs can be very handy.
