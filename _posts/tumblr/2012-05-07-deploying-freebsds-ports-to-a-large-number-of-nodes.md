---
layout: post
title: Deploying FreeBSD's Ports to a large number of nodes
date: '2012-05-07T16:22:24+03:00'
tags:
- FreeBSD
redirect_from: /post/92729962769/deploying-freebsds-ports-to-a-large-number-of-nodes
---

Some time ago, I posted a [question](http://serverfault.com/questions/364556/how-do-you-manage-and-deploy-freebsds-ports-in-a-large-environment) on Serverfault about how people managed and deployed ports in a large environment. Despite a fair number of comment, nobody seemed to really have the anser to this (or at least that suited my needs). It simply appears to be the case that the built-in tools in FreeBSD (primarily portsnap and portupgrade) are not built for a shared ports-tree.

Having a local ports-tree on each node seemed both wasteful and inefficient to me, yet this what was I had to resort to.

With that decided, how do you optimize the setup given this new setup?

### Distribute packages

The new setup won’t require any special configuration of either portsnap or ports itself (unlike my previous approach discussed in the Serverfault-post). That said, we do however want to utilize NFS for sharing the folder ‘/usr/ports/packages.’ If we don’t do that, we won’t be able to build and distribute packages to be used with portupgrade easily.

### Use a caching proxy

Since portsnap simply talks over the HTTP-protocol (via ‘fetch’), we can utilize a caching proxy. This will both offload the official servers and speed up the process. To accomplish this, just set up Squid on one of your servers. Just make sure you increase the caching size to something like 500MB on disk to make sure that all the files fit in the cache. With Squid up and running, simply run the following on each node:

**On Csh:**

    setenv http_proxy http://myserver:3128

**On Bash:**

    export http_proxy="http://myserver:3128"

While this is still not as KISS as simply exporting the ports-tree, it is better than just having a stand-along setup on each node. Also, keep in mind that both Squid and your NFS server are SPOFs. For a production environment, consider adding failover to both.
