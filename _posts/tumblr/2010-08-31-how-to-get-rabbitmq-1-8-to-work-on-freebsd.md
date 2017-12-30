---
layout: post
title: How to get RabbitMQ 1.8 to work on FreeBSD
date: '2010-08-31T14:40:41+03:00'
tags:
- FreeBSD
- RabbitMQ
permalink: /post/92729924064/how-to-get-rabbitmq-1-8-to-work-on-freebsd
---
**Update:** Thanks to Phillip (the maintainer of the package), this issue has now been resolved for RabbitMQ 2.0. The instructions below still applies if you for some reason prefer to run RabbitMQ 1.8.

This post might be irrelevant as soon as the port maintainer resolves this issue, but as I’m writing this, th**is bug will prevent you from running** RabbitMQ successfully.

Installing RabbitMQ is simple, but there are a few tricks that you might want to keep in mind. Before we build RabbitMQ, let’s build Erlang.

    cd /usr/ports/lang/erlang  
    make config

Make sure you deselect Java, VX and X11, as you don’t need them if you’re only planning to run Rabbit.

    make install

  
Now, let’s build Rabbit:

    cd /usr/ports/net/rabbitmq  
    make install

If you are getting errors when compiling RabbitMQ, it could be due to a problem with ‘docbook’ (at least that happened to me). The error I got said something about docbook and XML. To resolve that, recompile docbook (/usr/ports/textproc/docbook) with all options available (run ‘make config’ and check everything). I know it’s not a very scientific approach, as I should have dugg out what actual dependency it was, but it did the tric.

Assuming everything went well, all you need to do is to add “rabbitmq_enable=”YES”” to /etc/rc.conf

    echo -e “\\nrabbitmq_enable=\\”YES\\”” >> /etc/rc.conf

Now we can start RabbitMQ:

    /usr/local/etc/rc.d/rabbitmq start

Finally, we need to fix the bug that I was referring to in the opening of the article. To do this, we need to get the rabbitmqctl-file from RabbitMQ 2.0. I’ve uploaded extracted it for you and made it available for download, but you can as well get it from the tar-ball [here](http://www.rabbitmq.com/releases/rabbitmq-server/v2.0.0/rabbitmq-server-generic-unix-2.0.0.tar.gz).

    cd ~  
    fetch [http://viktorpetersson.com/upload/rabbitmqctl](http://viktorpetersson.com/upload/rabbitmqctl)  
    chmod +x rabbitmqctl  
    mv /usr/local/sbin/rabbitmqctl /usr/local/sbin/rabbitmqctl.bak  
    mv rabbitmqctl /usr/local/sbin/rabbitmqctl

You should now be able to use RabbitMQ. To create a user, simply run:

    sudo -H -u rabbitmq rabbitmqctl add_user username password

Unfortunately there is still another bug that prevents you from running “/usr/local/etc/rc.d/rabbitmq stop”, but I haven’t found a solution for that as I’m writing this.

**Credit**: Thanks to blunt_ from #rabbitmq on FreeNode
