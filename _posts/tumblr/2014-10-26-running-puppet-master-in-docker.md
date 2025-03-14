---
layout: post
title: Running Puppet master in Docker
date: '2014-10-26T16:00:10+02:00'
tags:
- puppet
- puppet master
- docker
- DevOps
- automation
- container
- linux
redirect_from: /post/100997217139/running-puppet-master-in-docker
---

In the past, I’ve relied a lot on Puppet for automation. That means that I have a fair number of Puppet masters at my disposals.

Puppet is a Ruby based application. As many Ruby based applications, it depends on a fairly large number of other libraries. Having to install all these packages on a brand new server is a pity.

In addition, the recommended approach is to run the Puppet master with Apache and [passenger](https://www.phusionpassenger.com/), which complicates things further if are running another web server, such as Nginx, on the same server.

I like to keep my servers tidy and clean, hence having to install all these dependencies bothers me. This is where Docker comes it play; by putting things inside a container, you can avoid polluting the host system and also make the setup less complex.

This weekend I decided to try to create a _dockerized_ Puppet master. There were a fair number of quirks that I had to sort out, but I eventually got it to work well, and I’m happy with the result.

To create your own Puppet master using my container, all you need to do is to run the following command:

    docker run -d \
      --name puppetmaster \
      --restart always \
      -h puppet.local \
      -p 8140:8140 \
      -e 'ACLGRANT=a.b.c.d/24' \
      -v /path/to/datastore:/var/lib/puppet \
      -v /path/to/modules:/etc/puppet/modules \
      -v /path/to/manifests:/etc/puppet/manifests \
      -t vpetersson/puppetmaster

The command above might seem a bit overwhelming, and you can find more detailed information about the command and how to use the container over at its home at [github](https://github.com/vpetersson/docker-puppetmaster).

In the next few days, I’m planning to roll out this in production and I’m looking forward to simplifying my future Puppet deployments.
