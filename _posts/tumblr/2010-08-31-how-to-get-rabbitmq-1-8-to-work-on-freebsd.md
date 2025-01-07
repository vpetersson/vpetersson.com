---
layout: post
title: How to get RabbitMQ 1.8 to work on FreeBSD
date: '2010-08-31T14:40:41+03:00'
tags:
- FreeBSD
- RabbitMQ
redirect_from: /post/92729924064/how-to-get-rabbitmq-1-8-to-work-on-freebsd
---
**Update:** Thanks to Phillip (the maintainer of the package), this issue has now been resolved for RabbitMQ 2.0. The instructions below still applies if you for some reason prefer to run RabbitMQ 1.8.

This post might be irrelevant as soon as the port maintainer resolves this issue, but as I’m writing this, th**is bug will prevent you from running** RabbitMQ successfully.

Installing RabbitMQ is simple, but there are a few tricks that you might want to keep in mind. Before we build RabbitMQ, let’s build Erlang.

First, install Erlang:

```bash
cd /usr/ports/lang/erlang
make config
```

Make sure to select all options, then:

```bash
make install
```

Next, install RabbitMQ:

```bash
cd /usr/ports/net/rabbitmq
make install
```

Enable RabbitMQ at startup:

```bash
echo -e "\nrabbitmq_enable=\"YES\"" >> /etc/rc.conf
```

Start RabbitMQ:

```bash
/usr/local/etc/rc.d/rabbitmq start
```

Fix the control script:

```bash
cd ~
fetch http://viktorpetersson.com/upload/rabbitmqctl
chmod +x rabbitmqctl
mv /usr/local/sbin/rabbitmqctl /usr/local/sbin/rabbitmqctl.bak
mv rabbitmqctl /usr/local/sbin/rabbitmqctl
```

Create a user:

```bash
sudo -H -u rabbitmq rabbitmqctl add_user username password
```

Unfortunately there is still another bug that prevents you from running “/usr/local/etc/rc.d/rabbitmq stop”, but I haven’t found a solution for that as I’m writing this.

**Credit**: Thanks to blunt_ from #rabbitmq on FreeNode
