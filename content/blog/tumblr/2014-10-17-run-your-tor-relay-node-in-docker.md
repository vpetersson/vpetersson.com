---
slug: run-your-tor-relay-node-in-docker
title: Run your Tor Relay Node in Docker
date: '2014-10-16T21:40:00+00:00'
tags:
- Docker
- tor
- privacy
- censorship
aliases: /post/100192280434/run-your-tor-relay-node-in-docker
---

[Tor](https://www.torproject.org) is a project that I really love to support. In this age of increased surveillance, Tor is needed more than ever.

Unfortunately, your own Tor Exit Node can put you in a lot of trouble due to the fact that Tor being used for all kinds of abuses. This is unfortunately a the reality of anonymity; some people will abuse it.

Yet, we shall not let this overshadow the fact that Tor is a critical tool for or **a lot** of people out there who are trying to circumvent government censorship. I want to help **these people** with the resources I have available at my disposal. As a result, I have run a number of Tor servers over the years.

If you don’t want to take the risk of running your own Exit Node, you can still help by running a Relay Node. To simplify the deployment of this (and to increase the security of your server), I’ve created a [Docker container](https://github.com/vpetersson/docker-torrelay) that does just that.

With Docker installed, all you need to do is to run the following:

    $ sudo docker run -d \
        -p :9001:9001 \
        --restart=always \
        --name=torrelay \
        -t vpetersson/torrelay

This will create a Tor Relay Node. All you need to do is to open up your firewall, such that the Docker container is reachable on port 9001.

Update: I just updated the name of the container added more info. Please check the github page for more details.
