---
slug: how-to-build-apache-and-modwsgi-with-python-2-7-on-free
title: How to build Apache and mod_wsgi with Python 2.7 on FreeBSD
date: '2010-09-08T23:27:01+00:00'
tags:
- Apache
- Django
- FreeBSD
- Note-to-self
aliases: /post/92729924544/how-to-build-apache-and-modwsgi-with-python-2-7-on-free
---

We’re probably not the only company switching to Python 2.7. Right now, we’re in the final phase of rolling out an updated version that uses Python 2.7. As I was setting up our servers, I ran into a few issues with packages who were hardcoded to use Python 2.6 or earlier.

Both [Chronicle](http://www.chronicle.im) and [YippieMove](http://www.yippiemove.com) are using Django, and use on Apache with mod_wsgi. When building these two packages, we found out that were both hardcoded to use Python 2.6 or earlier. Fortunately, there’s a simple solution for it.

The first package is ‘dev/apr1′, one of Apache’s dependencies. To resolve this issue, simply edit _‘/usr/ports/dev/apr1/Makefile’_. Find the line that says:

> USE\_PYTHON\_BUILD= -2.6

and replace it with:

> USE\_PYTHON\_BUILD= -2.7

The second application is mod\_wsgi (www/mod\_wsgi) itself. To resolve this edit ‘_/usr/ports/www/mod_wsgi/Makefile_‘ and change the line:

> USE_PYTHON= 2.4-2.6

to

> USE_PYTHON= 2.4-2.7

Both packages will compile just fine with Python 2.7, so no worries. I have notified both maintainers, but in the meantime, the above fix should do. Also, don’t forget to run ‘make clean’ before you try to rebuild the packages. Just for the record, we’re running FreeBSD 8.1 (AMD64), but that shouldn’t matter for the issue above.
