---
layout: post
title: The dangers of UFW + Docker
date: '2014-11-03T23:51:00+02:00'
tags:
- Docker
- ufw
- ubuntu
- linux
- DevOps
redirect_from: /post/101707677489/the-dangers-of-ufw-docker
---

In recent years, I’ve transitioned over to using Ubuntu’s [UFW](https://help.ubuntu.com/community/UFW). In most cases, it gets the job done and it is easy to manage via provisioning tools like [Ansible](http://www.ansible.com).

As turns out however, using UFW together with Docker can be _very_ dangerous as I will show below.

Let’s start with an Ubuntu 14.04 server. It has UFW and Docker installed already, so let’s start by configuring UFW to block everything but SSH.

    $ ufw allow ssh
    [...]
    $ ufw default deny incoming
    [...]
    $ ufw enable
    [...]
    $ sudo ufw status
    Status: active

    To                         Action      From
    --                         ------      ----
    22                         ALLOW       Anywhere
    22 (v6)                    ALLOW       Anywhere (v6)

That looks good. The default policy is set to deny all incoming traffic, and we only poke hole on port 22.

Let’s move on to Docker. For this example, we’ll use the latest version as of this writing.

    $ docker version
    Client version: 1.3.1
    Client API version: 1.15
    Go version (client): go1.3.3
    Git commit (client): 4e9bbfa
    OS/Arch (client): linux/amd64
    Server version: 1.3.1
    Server API version: 1.15
    Go version (server): go1.3.3
    Git commit (server): 4e9bbfa

Let’s now spin up a MongoDB server to listen on 0.0.0.0:27017. While a bad security practice, the firewall **should** block all external connections to it.

    $ docker run -d -p 27017:27017 --name mongodb dockerfile/mongodb
    [...]
    $ docker ps
    CONTAINER ID        IMAGE                       COMMAND             CREATED             STATUS              PORTS                                 NAMES
    f07c734038c5        dockerfile/mongodb:latest   "mongod"            5 seconds ago       Up 4 seconds        28017/tcp, 0.0.0.0:27017->27017/tcp   mongodb

With the server up and running, we can see that it is listening as expected.

I will now try to connect to my MongoDB server from my laptop on the public interface:

    $ mongo --host a.b.c.d
    MongoDB shell version: 2.6.5
    connecting to: a.b.c.d:27017/test
    Welcome to the MongoDB shell.
    For interactive help, type "help".
    For more comprehensive documentation, see
        http://docs.mongodb.org/
    Questions? Try the support group
        http://groups.google.com/group/mongodb-user

Wait, what?! That shouldn’t be possible!

Let’s take another look at UFW.

    $ ufw status
    Status: active

    To                         Action      From
    --                         ------      ----
    22                         ALLOW       Anywhere
    22 (v6)                    ALLOW       Anywhere (v6)

That still looks fine, so how did this happen?

As it turns out, Docker tampers directly with `iptables`.

    $ iptables -L | grep 27017
    ACCEPT     tcp  --  anywhere             172.17.0.2           tcp dpt:27017

It is expected that Docker tampers with the firewall rules to some extent. It is after all what enable Docker containers to bind on a port. Yet, this behavior is not what I would have expected.

So what’s the moral of the story here?

- UFW doesn’t tell you `iptables` _true_ state (not shocking, but still).
- **Never** use the `-p` option (or `-P`) in Docker for something you don’t want to be public.
- **Only** bind on either the loopback interface or an internal IP.

## Update

[@karl_grz](https://twitter.com/@karl_grz) correctly pointed out that it is possible to override this behavior by adding `--iptables=false` to to the Docker daemon. This is also described [here](http://docs.docker.com/articles/networking/#communication-between-containers). It still beats me why this isn’t the default configuration.

On Ubuntu, you can edit `/etc/default/docker` and uncomment the DOCKER_OPTS line:

    DOCKER_OPTS="--dns 8.8.8.8 --dns 8.8.4.4 --iptables=false"

After doing so, you need to restart Docker with `service restart docker`.

I also tested this and can confirm that I was able to connect to MongoDB on the host, but **not** from my laptop on the public interface.

Thanks for pointing that out, Karl.
