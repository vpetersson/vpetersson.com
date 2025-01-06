---
layout: post
title: Using cgroups with Docker on Ubuntu 14.04
date: '2015-04-05T13:12:25+03:00'
tags:
- Docker
- cgroups
- linux
- DevOps
- ubuntu
- Ubuntu Linux
redirect_from: /post/115562026784/using-cgroups-with-docker-on-ubuntu-1404
---
As I was working on my upcoming presentation at [ApacheCon](http://www.apachecon.com/), I was playing a little bit with cgroups inside Docker.

What I found was that there aren’t a whole lot of documentation on this, so I figured I put together a quick blog post about it.

Enable the LXC driver
---------------------

Assuming you already have Docker installed on Ubuntu 14.04, you will still need to enable the LXC driver.

To do this, you will need to do the following

    $ sudo apt-get install -y lxc
    $ echo 'DOCKER_OPTS="--exec-driver=lxc"' \
        | sudo tee -a /etc/default/docker
    $ sudo service docker restart
    

Spin up two containers without cgroup policy
--------------------------------------------

Let’s start by launching two containers that each will max out the CPU (by running `md5sum /dev/urandom`).

    docker run -d busybox md5sum /dev/urandom
    docker run -d busybox md5sum /dev/urandom
    

![Docker containers running without cgroup policy](/tumblr_files/tumblr_inline_nmbyklbgPw1skxjxc_540.png)

As expected, we can see that these containers fully utilize one core each.

Spin up two containers with cgroup policy
-----------------------------------------

Now let’s put the new LXC options to use by adding two cgroup policies. What we’re looking to do is to the same workload as before, but run them on the same core. We would then expect them to occupy 50% of the core each. However, we want to give one container 75% of the CPU share, and the other only 25%. To accomplish this, we use ‘cpu.shares’ to divvy up the CPU and 'cpuset.cpus’ to lock the containers to the same core.

Start container with low priority:

    $ docker run -d --name='low_prio' \
        --lxc-conf="lxc.cgroup.cpu.shares=250" \ 
        --lxc-conf="lxc.cgroup.cpuset.cpus=0" \
        busybox md5sum /dev/urandom
    

Start container with high priority:

    $ docker run -d --name='high_prio' \
        --lxc-conf="lxc.cgroup.cpu.shares=750" \ 
        --lxc-conf="lxc.cgroup.cpuset.cpus=0" \
        busybox md5sum /dev/urandom
    

![Docker containers running with cgroup policy](/tumblr_files/tumblr_inline_nmbyk9EJyj1skxjxc_540.png)

As you can see, it worked! Happy hacking!

**Update:** For more details about how to use Docker with Cgroups, please take a look at my blog post [Manage Docker resources with Cgroups](https://www.cloudsigma.com/manage-docker-resources-with-cgroups/) over at CloudSigma’s blog.
