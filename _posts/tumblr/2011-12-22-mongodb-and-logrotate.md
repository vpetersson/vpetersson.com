---
layout: post
title: MongoDB and logrotate
date: '2011-12-22T21:26:08+02:00'
tags:
- MongoDB
redirect_from: /post/92729953474/mongodb-and-logrotate
---

I’ve been using MongoDB now for some time in production. It’s great, and I really love how easy it is to set up and scale with replica sets etc.

There is one thing that bugs me with MongoDB though. Instead of following the praxis of using Logrotate, they’ve decided to re-invent the wheel by building in a log rotation-feature (that is less powerful than Logrotate). The documentation on MongoDB’s log rotation-feature can be found [here](http://www.mongodb.org/display/DOCS/Logging), but the gist of it is that you send ‘_kill -SIGUSR1 PID_‘ to MongoDB and it will automatically rotate and rename the old logfile to something like ‘_mongod.log.2011-12-22T17-05-50_‘.

There are some issues with this. If we were to only rely on the built-in log rotation-feature, we would need to address the issues of vacuuming old files (as this is not supported). Moreover, the built-in logrotation feature doesn’t support compression of old logs, which means your old log files will take up a lot more space.

There is however a way to use MongoDB with logrotate. It’s just a bit more messy than most other applications. If we assume that MongoDB is configured to spit out log-files to ‘_/var/log/mongodb/_‘, we could simply use the following logrotate script:

    /var/log/mongodb/mongod.log {
    	daily
    	missingok
    	rotate 7
    	compress
    	delaycompress
    	notifempty
    	create 640 mongodb mongodb
    	sharedscripts
    	postrotate
    		killall -SIGUSR1 mongod
    		find /var/log/mongodb/ -type f -regex ".*\\.\\(log.\[0-9\].*-\[0-9\].*\\)" -exec rm {} \\;
    	endscript
    }

The real ‘hack’ here is the somewhat ugly find-command that deletes the log-file generated by MongoDB. It uses a Regular Expression that only matches the MongoDB-generated files, and leaves the logrotate-files alone (as they are named mongodb.log.\[0-9\].gz).
