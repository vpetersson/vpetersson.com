---
layout: post
title: 'Solution for "[Errno 13] Permission denied: ''/nonexistent''" in mod_wsgi'
date: '2010-08-27T00:49:36+03:00'
tags:
- Django
- FreeBSD
- mod_wsgi
- Python
redirect_from: /post/92729922964/solution-for-errno-13-permission-denied-nonexistent-in-m
---

While upgrading to Python 2.7 on one of our development servers (FreeBSD 7.2), I ran across a somewhat strange error with Django (or rather mod_wsgi). Since I didn’t find a whole lot useful results when I Googled for it, I decided to do a brief write-up about it.

The error I received was as follows:

> \[Errno 13\] Permission denied: ‘/nonexistent’

As it turns out ‘/nonexisten’ is the home-directory for ‘www’ on FreeBSD. This is good, as you want your webserver to have as little write-access as possible. The problem is that Python uses something called Egg-files for its modules. These can be either stored extracted or compressed. The compressed ones are basically just a zip-file with the .egg-extension. The above error originates from when mod_wsgi tries to extract one of these .egg-files in the home-directory. Since ‘/nonexistant’ is non-existing folder (shocking, right?), it fails.

Some people out there suggest that you change www’s home-directory and give it write-access. I suggest a different approach: Extract the compressed egg-files. I wrote a simple Bash-script to take care of the task:

> #!/bin/sh
>
> \# The path to your site-packages directory.\
> SITEPACKAGES=/usr/local/lib/python2.7/site-packages
>
> for i in $(find $SITEPACKAGES -type f -maxdepth 1 |grep .egg |grep -v egg-info); do\
> unzip $i -d $SITEPACKAGES\
> rm -rf $SITEPACKAGES/EGG-INFO\
> rm -f $i\
> done;

It’s not very pretty, but it gets the job done. If you think the second ‘grep’ for ‘egg-info’ looks weird, it’s to exclude .egg-info files. You don’t need to extract them, as it’s not the “real” module.

Personally I don’t really see the reason for modules to compress .egg files. I just can’t see the justification for saving a few bytes (these modules are usually very small) and instead having to waste extra CPU and I/O when extracting these files at run.

Anyways, that’s how I solved it the problem and it did the trick for me. And as always, if you manage to screw the above script up and it wipes all your data, don’t come to me crying. Running script as root (or with sudo) is dangerous and you should always be careful.
