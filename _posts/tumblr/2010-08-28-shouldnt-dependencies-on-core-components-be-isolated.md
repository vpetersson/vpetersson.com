---
layout: post
title: Shouldn't dependencies of core components be isolated?
date: '2010-08-28T15:41:19+03:00'
tags:
- chroot
- FreeBSD
- jail
- Linux
- Ubuntu
permalink: /post/92729923604/shouldnt-dependencies-on-core-components-be-isolated
---
Local management tools are critical for most Linux and Unix distributions. For instance, if you delete Python 2.6 from your Ubuntu installation, it becomes more or less unusable. This is because most local management tools are written in Python. I have no problem with this. On the contrary, I think it makes a whole lot of sense to write management tools in a high-level language, such as Python or Ruby.

The problem is that there are many circumstances in where you’d would need to install a different version of these languages, as some other tool or application you’re using requires it. This is likely to cause problems. It is particularly true if you’re running an LTS-version of Ubuntu, or CentOS/RHEL (which is still using Python 2.5). Yes, you can run multiple versions of Python on the same machine, but it’s quite likely that applications will be confused on what version to use. Also, what version should you point the command ‘python’ to? Yes, you can call on Python with it’s full name (ie python26), but ‘python’ is still what many scripts call on.  
  
To resolve this problem, why don’t we isolate these components into it’s own environment? On FreeBSD, ‘jails’ could be used and on Linux, perhaps ‘chroot’ can be used. Then these management tools can run within this environment and just use some kind of bridging tool to connect it to the user environment.

That way it doesn’t matter what kind of version that the base-system is running, because the core components are isolated anyways. While I reckon that this would take up extra disks space, but for everything but embedded systems, 100 MB (or whatever it would take), isn’t a big deal.

I’m not sure if I’m onto something here, or if I’m just rambling. Just though it’s an interesting idea, and it was worth putting out there.
