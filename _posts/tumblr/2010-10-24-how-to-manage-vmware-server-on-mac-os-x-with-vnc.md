---
layout: post
title: How to manage VMware Server on Mac OS X with VNC
date: '2010-10-24T14:24:36+03:00'
tags:
- Linux
- VMware
redirect_from: /post/92729928924/how-to-manage-vmware-server-on-mac-os-x-with-vnc
---

VMware Server is a great product. It’s free and works well with most guest operating systems. However, there is **one major drawback** – you cannot use the ‘console’ app on Mac OS X. For some strange reason, VMware decided to only make the required Firefox plug-in available for Linux and Windows. Given that Mac OS X is the OS of choice for most tech-savvy users I know, this decision makes no sense at all. While I rarely need the console for an existing virtual machine (other than if it fails to boot or something similar), it is obviously required to install the operating system onto the virtual machine.

Until recently, I had to either remotely log into a Windows or Linux machine (or even more ironically, open it in a local virtual machine). Luckily there is a workaround: the built in VNC-support. It is a bit annoying to have to do this, but it’s probably faster than having to log into a remote machine just to access the console.\
![](http://viktorpetersson.com/wp-content/uploads/2010/10/VNC-on-Mac-OS-600x478.png "VNC on Mac OS")

_VNC connection directly to a VMware virtual machine._

Here’s how you do it:

- Create a new virtual machine in VMware Server.
- Before booting up the virtual machine, open the .vmx-file that resides inside the folder for the new virtual machine.
- Add the following line:

      RemoteDisplay.vnc.enabled = TRUE  
      RemoteDisplay.vnc.password = mypassword  
      RemoteDisplay.vnc.port = 5900

- Boot the virtual machine.

This will start a VNC server on port 5900. You can use a regular desktop client to connect to it. You can even use the built-in VNC client on Mac OS X (“Go” -> “Connect to Server” -> “vnc://\[IP to your server\]:0″).

If you’re not familiar with VNC, “:0″ is the first server and is the same as “:5900″. If you have multiple virtual machines you want to access, you would configure the next virtual machine to bind on port 5901 (:1 in VNC), and so on.

### Accessing the server remotely

If you’re like me, you don’t have your VMware Servers on the same physical network as you are working from. In order to access them via VNC you need to do some magic with SSH. It’s really quite easy though. All you need to do is to create an SSH tunnel from your localhost and forward it to the appropriate port on the remote server.

To do this, open up the terminal and run the following command:

    ssh -L 127.0.0.1:5900:192.168.10.2:5900 -N -vv username@remoteserver.com

In this case we create a tunnel on localhost’s port 5900 and point it towards a remote server. The remote VMware server listens on the IP address 192.168.10.2, and the we’re connecting to port 5900.

With the tunnel established, we can connect to the remote virtual machine with the built-in VNC client with the following steps:\
“Go” -> “Connect to Server” -> “vnc://127.0.0.1:0″).

For more info on VMware and VNC, please see [this VMware KB](http://kb.vmware.com/selfservice/microsites/search.do?language=en_US&cmd=displayKC&externalId=1246) entry.
