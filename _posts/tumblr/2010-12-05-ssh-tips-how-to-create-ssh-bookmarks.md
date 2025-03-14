---
layout: post
title: How to create SSH 'bookmarks'
date: '2010-12-05T16:01:40+02:00'
tags:
- Linux
- Mac OS X
- SSH
- Unix
redirect_from: /post/92729939439/ssh-tips-how-to-create-ssh-bookmarks
---

If you’re like me, you spend a lot of time in the terminal window. It’s not rare that I SSH into 10+ different servers in a day. Having easy-to-remember FQDN’s makes it easier, but sometimes that’s not possible. Sometimes you only have an IP to a server, perhaps the server has a really long FQDN, or perhaps SSH is running on some arbitrary port. That makes your life harder. Luckily there’s an easy fix for it.

Many people do not know that SSH comes with a bookmarkish feature out-of-the-box. All you need to do is to open up _~/.ssh/config_ (create it if it doesn’t exist) and add something like this:

> host foobar\
>  hostname aaa.bbb.ccc.ddd\
>  port 2224

(Please note that the second and third lines are indented with a space.)

Now you can SSH into ‘foobar’ by simply typing:

> ssh foobar

And voila, you no longer need to remember all arbitrary ports, IPs and hostnames. All you need to remember is your bookmark.

For more information on what you can do with ~/.ssh/config, please see [this](http://www.openbsd.org/cgi-bin/man.cgi?query=ssh_config) page.

Please note that this works on pretty much any platform except for Windows. But then again, if you’re this savvy, you probably know better than to run Windows in the first place =).
