---
layout: post
title: Monitor Nginx and disk-usage with Monit
date: '2010-07-12T12:19:58+03:00'
tags:
- Linux
- Monit
- Nginx
- Ubuntu
redirect_from: /post/92729917874/monitor-nginx-and-disk-usage-with-monit
---

Yesterday I posted an article on [how to monitor Apache and PostgreSQL with Monit](http://viktorpetersson.com/2010/07/09/setting-up-monit-to-monitor-apache-and-postgresql-on-ubuntu/). After setting that up I was amazed how simple and flexible Monit was, so I moved on with two more tasks: monitor Nginx and disk usage.

This article assumes that you’ve set up Monit in accordance with the previous article. It also assumes that you’re on Ubuntu 9.10 or 10.04. If you use a different Linux or Unix flavor, you will probably need to modify a few paths.

#### Nginx

(/etc/monit/conf.d/nginx.conf)

> check process nginx with pidfile /var/run/nginx.pid\
> group www\
> start program = “/etc/init.d/nginx start”\
> stop program = “/etc/init.d/nginx stop”\
> if children > 250 then restart\
> if loadavg(5min) greater than 10 for 8 cycles then stop\
> if 3 restarts within 5 cycles then timeout

[Download](http://viktorpetersson.com/upload/monit/nginx.conf)

#### Disk usage

(/etc/monit/conf.d/diskusage.conf)

> check filesystem md3 with path /dev/md3\
> group server\
> if failed permission 660 then unmonitor\
> if failed uid root then unmonitor\
> if failed gid disk then unmonitor\
> if space usage > 80 % then alert\
> if inode usage > 80 % then alert

[Download](http://viktorpetersson.com/upload/monit/diskusage.conf)

Please note that the above script monitors ‘/dev/md3.’ You can replace this with the path to the file system you want to monitor, such as /dev/sda1 or /dev/hda1. You can also configure Monit to take actions based on certain criterions, but I left that part out as I didn’t find any need for it. You can read more about that [here](http://mmonit.com/monit/documentation/monit.html). If you want to monitor more file systems, simply repeat the above config with a different ‘path.’

Once you’ve added you new configs, you need to restart Monit (/etc/init.d/monit restart).
