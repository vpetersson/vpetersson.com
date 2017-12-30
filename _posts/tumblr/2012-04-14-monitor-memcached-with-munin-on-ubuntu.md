---
layout: post
title: Monitor Memcached with Munin (on Ubuntu)
date: '2012-04-14T21:41:29+03:00'
tags:
- Munin
- Ubuntu
permalink: /post/92729962289/monitor-memcached-with-munin-on-ubuntu
---
Let me first admit that I am new to Munin. I’ve played around with most monitoring tool, but never Munin for some reason. I really don’t know why, since it appears to be a great tool. As a result, this might be obvious to seasoned Munin-users, but it wasn’t to me at least.

It appear as most stock-plugins are configured in _/etc/munin/plugin-conf.d/munin-node_. This isn’t the case for the Memcached plugin. Hence this post.

Start by grabbing the Memcached plugin from [here](https://github.com/munin-monitoring/contrib/tree/master/plugins/memcached). Copy these files to _/usr/share/munin/plugins_.

Next, install the required Memcached-perl plugin:

	sudo apt-get install libcache-memcached-perl

Now to the strange part. In order for this plugin to work, we need to include the hostname and the port of Memcached in the filename. We do this we create a symlink to the plugin that includes this info (eg. `memcached\_traffic\_127\_0\_0\_1\_11211` if Memcached is listening on 127.0.0.1:11211).

Since I deployed this on a few servers, I wrote a simple shell-script that does this:

	#!/bin/bash
	for i in $(find /usr/share/munin/plugins/memcached*); do
		ln -s $i /etc/munin/plugins/$(basename $i)127\_0\_0\_1\_11211
	done

After you’ve installed the plugin, let’s make sure it worked.

	#!/bin/bash
	for i in $(find /etc/munin/plugins/memcached*); do
		sudo munin-run $i
	done

Assuming you didn’t get any errors when running the script above, go ahead and restart Munin-node (service munin-node restart).

**Update**: It appears as this is a pretty common approach to pass variables to Munin-plugins.
