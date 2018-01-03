---
layout: post
title: 'Fixing "su: unknown login: %%PG_USER%%" on FreeBSD'
date: '2011-08-15T18:04:54+03:00'
tags:
- FreeBSD
- PosgreSQL
redirect_from: /post/92729948959/fixing-su-unknown-login-pguser-on-freebsd
---
Today as I was installing PostgreSQL 9.04 on a new server I encountered the following error:

    \[root@host ~\]# /usr/local/etc/rc.d/postgresql initdb
    su: unknown login: %%PG_USER%%

Something obviously went wrong when the port was being installed. Most likely it’s a bug in the build-instructions for the port. No stress though, as there is an easy fix. Just open up `_/usr/local/etc/rc.d/postgresql_` and modify the line

    postgresql\_user=${postgresql\_user:-"%%PG_USER%%"}

with

    postgresql\_user=${postgresql\_user:-"pgsql"}

(or I suppose you could add “postgresql_user=pgsql” to rc.conf).

You should now be able to initiate PostgreSQL.
