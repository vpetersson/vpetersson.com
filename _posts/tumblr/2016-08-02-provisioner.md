---
layout: post
title: Provisioner
date: '2016-08-02T11:10:45+03:00'
tags:
- ansible
- docker
- devops
permalink: /post/148341424869/provisioner
---
[Provisioner](https://provisioner.vpetersson.com/)  

I’ve been working on Provisioner for a while now and it’s starting to come together. Most recently I rolled out complete API documentation as well as a brand spanking new website (powered by Jekyll and Github Pages).

I’m still trying to think of more use cases, so that’s part of what I will be working on next, as well as better documentation at large. I’ve also started to work on a Python library for easier integration work.

Here are some use cases that I’m thinking of:

*   Bootstrap remote servers (original concept)
*   CI/CD assistance for pushing out playbooks to remote servers (store SSH Keys in Provisioner)
    *   Perhaps integrating with Hashicorp Vault?
*   IFTT or similar integration (?)
*   PaaS support (Heroku/Deis etc) for easier deployment
