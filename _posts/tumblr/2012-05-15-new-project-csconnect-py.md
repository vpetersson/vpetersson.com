---
layout: post
title: 'New project: csconnect.py'
date: '2012-05-15T22:32:10+03:00'
tags:
- CloudSigma
- Python
- SSH
redirect_from: /post/92729963354/new-project-csconnect-py
---
In the last few years, [we](http://wireload.net)‘ve spent a lot of time migrating away from all our physical servers and into the cloud. This has been a very interesting task, that presented its own set of challenges, but it has certainly been worth it.

One of the issues though with working in a public cloud environment is that you don’t necessarily have the same static IP configuration as you do with dedicated hardware. When you power off a node, and spin it back up (or clone a new server for that sake), it’s likely that it will switch IP. This is at least the case with CloudSigma, which is what we are using for a large part of our server needs.

Normally, you’d have to login to CloudSigma’s web-interface to find out the IP for a given node. Needless to say, this gets old pretty fast when you quickly want to SSH into a node.

To resolve this, I wrote [csconnect.py](https://github.com/vpetersson/csconnect)

This little handy script connects to CloudSigma’s API and resolves your IPs. It even uses a local cache of your servers IPs for quick lookups.
