---
layout: post
title: Copying users/groups between two FreeBSD servers
date: '2010-09-30T20:17:58+03:00'
tags:
- FreeBSD
- Note-to-self
permalink: /post/92729926614/copying-usersgroups-between-freebsd-servers
---
Sometimes you want to move **all** users and groups from one server to another without having to recreate all users. Let’s say you are retiring an old server and moving to a new server. If you’ve had the server for a while and have lots of users on it, the last thing you want to do is to recreate all users and assign new passwords.

If you’re on FreeBSD, the task is pretty trivial. I’m sure it’s pretty straight forward on Linux too, but these instructions only apply to FreeBSD. In my case I was moving the users from a FreeBSD 7.1 system to a brand new FreeBSD 8.1 server.  
  
There are three files you need to copy from the old to the new server. These are:

*   /etc/passwd
*   /etc/group
*   /etc/master.passwd

You might also want to copy the entire /home directory, so that the users get their user data across.

Once you’ve copied the files to the new system, you also need to rebuild the password database. To do that, run:

> pwd_mkdb -p /etc/master.passwd

The easiest way to get all that data across is to copy them over SSH with scp. You will need to enable root-login in sshd, but other than that, it is very straight forward. Here’s an example of all of the above if you’re logged into the new server.

> scp -r root@myoldserver:/usr/home/* /usr/home/  
> scp root@myoldserver:/etc/passwd /etc/  
> scp root@myoldserver:/etc/group /etc/  
> scp root@myoldserver:/etc/master.passwd /etc/  
> pwd_mkdb -p /etc/master.passwd

Pretty simple, huh?
