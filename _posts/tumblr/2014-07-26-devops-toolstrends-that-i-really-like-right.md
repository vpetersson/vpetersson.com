---
layout: post
title: DevOps tools/trends that I really like right now...
date: '2014-07-26T21:14:03+03:00'
tags:
- docker
- ansible
- coreos
- python
- fleet
- etcd
- systemd
permalink: /post/92940969784/devops-toolstrends-that-i-really-like-right
---
*   [**Docker**](https://www.docker.com/) and **Docker Hub** \- It’s awesome and it removes a lot of the complexity from traditional DevOps work. What’s funny is that while doing my migration to Tumblr, I found this [three year blog post](/2017/12/21/2010-08-28-shouldnt-dependencies-on-core-components-be-isolated.html) that pretty much describes Docker. Yes, it’s not too far from FreeBSD’s Jails, but it never had this momentum nor the toolset (which of course is a result of the momentum).
*   [**CoreOS**](https://coreos.com/), **Etcd**, **Systemd** and **Fleet** \- Once you have started to fully embrace Docker, CoreOS and its components just makes a ton of sense. I really hope that this is where we’re heading. Once you’ve had a taste of `fleetctl`, you’re hooked.
*   [**Ansible**](http://www.ansible.com) \- Sometimes you still need to manage servers and Ansible is a breeze of fresh air. Sorry, Puppet, but I’m done with you.
*   [**Python**](https://www.python.org/) \- Yes, in modern day DevOps, Bash simply won’t cut it. Python is a blessing when you need to interact with an API or similar.
