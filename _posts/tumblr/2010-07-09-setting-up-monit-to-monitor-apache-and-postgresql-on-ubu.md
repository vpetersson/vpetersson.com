---
layout: post
title: Setting up Monit to monitor Apache and PostgreSQL on Ubuntu
date: '2010-07-09T18:05:32+03:00'
tags:
- Apache
- Linux
- Monit
- PostgreSQL
- Ubuntu
redirect_from: /post/92729917189/setting-up-monit-to-monitor-apache-and-postgresql-on-ubu
---
[Monit](http://mmonit.com/monit/) is a great little utility that monitors your daemons. If a daemon fails, Monit will start the daemon it will automatically restart the process. It comes in very handy if for web-servers, such as Apache.

For [Red iGone](http://www.redigone.com) we use Apache as the web-server, and PostgreSQL as the database. I wanted to configure Monit to keep an eye on these processes. As it turns out, setting up Monit was really straight-forward.

I tried this on Ubuntu 9.10 and 10.04. If you try this on a different Ubuntu version (or other distribution), it is likely that you will need to make changes to apache.conf and postgresql.conf.

![](https://farm5.staticflickr.com/4082/4777587884_23d7aa9958_z_d.jpg)

_Monit in action._

### Install Monit

Installing Monit on Ubuntu is dead simple. Just run:

    sudo apt-get install monit

### Configure Monit

Now let’s configure Monit. We start with the generic config-file. Open **/etc/monit/monitrc** in your favorite editor and add the following line:  

    include /etc/monit/conf.d/*  

**Important**: Change permission on the folder /etc/monit/conf.d as it will include your email password stored in plain text.  

    sudo chmod a-rwx,u=rwX -R /etc/monit/conf.d/  


Next we need to edit **/etc/default/monit** and change “startup=0″ to “startup=1″.

Now we’re ready to really start configuring Monit. Just to keep things, organized, I’ve broken down the Monit’s settings into three files:

* basic.conf
* apache.conf
* postgresql.conf

In basic.conf I’ve put the generic Monit-configs, and then broken out Apache’s and PosgreSQL’s configs into their own files.

#### basic.conf

(/etc/monit/conf.d/basic.conf)

> set daemon 60  
> set logfile syslog facility log_daemon
> 
> set mailserver smtp.gmail.com port 587  
> username “user@domain.com” password “password”  
> using tlsv1  
> with timeout 30 seconds
> 
> set alert admin@domain.com
> 
> set httpd port 2812 and  
> use address localhost  
> allow localhost  
> allow admin:monit
> 
> check system localhost  
> if loadavg (1min) > 4 then alert  
> if loadavg (5min) > 2 then alert  
> if memory usage > 75% then alert  
> if cpu usage (user) > 70% then alert  
> if cpu usage (system) > 30% then alert  
> if cpu usage (wait) > 20% then alert

[Download](http://viktorpetersson.com/upload/monit/basic.conf)

The above file is configured to send email using Google Apps or Gmail. Just change your username and password according to your needs. I’ve also enabled Monit’s webserver that allows you to view Monit’s status directly in your browser. Access is restricted to localhost and you need to login with the username ‘admin’ and password ‘monit.

I prefer to restrict access to just localhost, and then use a SSH-tunnel to gain access.

#### apache.conf

(/etc/monit/conf.d/apache.conf)

> check process apache2 with pidfile /var/run/apache2.pid  
> group www  
> start program = “/etc/init.d/apache2 start”  
> stop program = “/etc/init.d/apache2 stop”  
> if children > 250 then restart  
> if loadavg(5min) greater than 10 for 8 cycles then stop  
> if 3 restarts within 5 cycles then timeout

[Download](http://viktorpetersson.com/upload/monit/apache.conf)

This is pretty straight forward. Assuming you use the Apache-distribution that came with Ubuntu, you shouldn’t need to modify anything.

#### postgresql.conf

(/etc/monit/conf.d/posgresql.conf)

> check process postgresql with pidfile /var/run/postgresql/8.4-main.pid  
> group database  
> start program = “/etc/init.d/postgresql-8.4 start”  
> stop program = “/etc/init.d/postgresql-8.4 stop”  
> if failed unixsocket /var/run/postgresql/.s.PGSQL.5432 protocol pgsql then restart  
> if failed unixsocket /var/run/postgresql/.s.PGSQL.5432 protocol pgsql then alert  
> if failed host localhost port 5432 protocol pgsql then restart  
> if failed host localhost port 5432 protocol pgsql then alert  
> if 5 restarts within 5 cycles then timeout

[Download](http://viktorpetersson.com/upload/monit/postgresql.conf)

The same thing applies here. Assuming you used the PosgreSQL-version (8.4) that came with Ubuntu, you shouldn’t need to modify anything here.

Final steps
-----------

Now that you have configured all the files, all that needs to be done is to fire up Monit and make verify that it is running. To launch Monit, simply run:  

    sudo /etc/init.d/monit start  


You can verify that Monit is running either by browsing to the webserver or checking /var/log/syslog. You should also receive an email that says that Monit is now running.

Assuming everything went well, you also want to make sure that Monit actually starts a  daemon if it is failing. A simple way to do that is to run:  

    sudo killall apache2  


That should kill Apache. Monit should be able to detect that and fire it back up shortly. Again, you should be able to monitor Monit’s process either by email, the web-interface, or in /var/log/syslog.

That’s it. Good luck!

**Update:** I decided to extend this guide and wrote another article on [how to monitor Nginx and disk-usage](http://viktorpetersson.com/2010/07/12/monitor-nginx-and-disk-usage-with-monit/) with Monit.
