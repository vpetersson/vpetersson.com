---
layout: post
title: Running KVM with Open vSwitch on Ubuntu 16.04
date: '2018-01-28T13:00:00+01:00'
tags:
- devops
- openvswitch
- ubuntu
- pfsense
- linux
---

If you're reading the [KVM/Networking documentation](https://help.ubuntu.com/community/KVM/Networking) for Ubuntu, you'll see that the recommended way to expose VMs to the world (public or private interface) is to use a Bridge. This was what I have been doing over the years. What you do realize however is that it becomes less than ideal when the network configuration is becoming complex. For instance, imagine that you're using two bonded interfaces (LACP) that you then expose to a bridge, which you in turn want to configure a set of VLANs on top of. That gets very messy using this method (and not to even mention the performance is poor in general).

Enter [Open vSwitch](http://openvswitch.org/). Contrary to Bridge interfaces, Open vSwitch acts, as the name implies, as a proper virtual switch. This unfortunately means that the learning curve is a bit steeper, but once you get a hold of it, it's not too bad and you will see a significant performance increase. Also, kudos to SoulChild for a great write-up on the [pfSense forum](https://forum.pfsense.org/index.php?topic=139045.0).

## Server and infrastructure setup

Before we begin, you will need the following:

- A layer 2 switch (with VLAN support)
- A modern server with Ubuntu 16.04 installed (the instructions will likely be similar on other OSes too)
- Physical access to the server (with a keyboard) in case something goes wrong

In this article, we're going to use the example of setting up a pfSense box as a VM with multiple VLANs exposed. We will assume the following VLAN setup and that you've already configured this in the switch:

- VLAN 100 - WAN
- VLAN 200 - LAN 1 (default)
- VLAN 201 - LAN 2
- VLAN 202 - LAN 3

With the architecture planned out, let's get down and dirty and start by installing Open vSwitch on the server:

```
$ sudo apt-get install openvswitch-switch
```

Next, we need to configure Open vSwitch. First, we'll create a bridge called `ovsbridge` using the following command:

```
$ sudo ovs-vsctl add-br ovsbridge
$ sudo ovs-vsctl set port ovsbridge tag=200
```

With that done, you now need to modify your `/etc/network/interfaces` file. It most likely looked something similar to this now:

```
auto eno1
    iface eno1 inet static
    address 192.168.200.4
    netmask 255.255.255.0
    gateway 192.168.200.1
    dns-nameservers 8.8.4.4 8.8.8.8
```

Now, in order for this to work with Open vSwitch, we need to make some changes to it and make it look like this:

```
auto eno1
iface eno1 inet manual

auto ovsbridge
iface ovsbridge inet static
    address 192.168.200.4
    netmask 255.255.255.0
    gateway 192.168.200.1
    dns-nameservers 8.8.4.4 8.8.8.8
```

Once done, we need to make a risky change. We now need to move the interface into the bridge and restart the server

```
$ sudo ovs-vsctl add-port ovsbridge eno1 \
    tag=200 trunk=100,201,202 && \
    sudo reboot now
```

If you're lucky, the server now comes back online and is accessible remotely directly. If not, you may need to delete the bridge and add it again slightly differently (depending on your switch):

```
$ sudo ovs-vsctl add-port ovsbridge eno1 \
    tag=200 trunk=100,201,202 \
    vlan_mode=native-tagged && \
    sudo reboot now
```

## VM configuration

You can now create the pfSense VM using your preferred method. Mine is a combination `virt-manager` and `virsh`. Once you start the VM, edit the VM definition using `virsh edit`. Since we want to expose the VM to all our VLANs, we want to edit the network interface section to look something like this:

```
<interface type='bridge'>
  <mac address='XX:YY:ZZ:ZZ:YY:ZZ'/>
  <source bridge='ovsbridge'/>
  <vlan trunk='yes'>
    <tag id='100'/>
    <tag id='200'/>
    <tag id='201'/>
    <tag id='202'/>
  </vlan>
  <virtualport type='openvswitch'>
  </virtualport>
  <target dev='pfSenseTrunk'/>
  <model type='virtio'/>
  <alias name='net0'/>
  <address type='pci' domain='0x0000' bus='0x00' slot='0x04' function='0x0'/>
</interface>
```

When you now boot up the VM, you should be able to access all of the specified VLANs in pfSense's setup and define them as outlined above.

If however for some reason you only want to expose one VLAN to a given VM as an untagged VLAN, you can do so by using the following snippet:

```
<source bridge='ovsbridge'/>
<vlan>
  <tag id='200'/>
</vlan>
<virtualport type='openvswitch'>
</virtualport>
<target dev='pfSenseTrunk'/>
```

## Final notes

This should hopefully help you get started with Open vSwitch. It's a big topic, so there's plenty to learn and this article by no means intends to cover it all. I would also encourage you again to take a look at SoulChild's great write-up on the [pfSense forum](https://forum.pfsense.org/index.php?topic=139045.0) if you're having any issues.

## Update

I have since posting this article moved to [Proxmox](https://www.proxmox.com/en/). While it doesn't support all OpenvSwitch features (such as trunking multiple VLANs on a single NIC to a VM), it is still worth it with the nice user interface and turn-key setup.
