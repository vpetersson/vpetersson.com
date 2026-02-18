---
slug: fixing-the-broken-nginx-plugins-in-ubuntu-optional-with
title: 'Fixing the broken Munin Nginx-plugins in Ubuntu (optional: with Puppet)'
date: '2012-08-16T21:58:13+03:00'
tags:
- Munin
- Puppet
- Ubuntu
aliases: /post/92729967514/fixing-the-broken-nginx-plugins-in-ubuntu-optional-with
---

I love Munin. It’s a great monitoring tool, quick to set up, and doesn’t come with too many bloated requirements. It’s also very flexible and easy to write plugins for.

On Ubuntu, Munin comes with most (non-custom) plugins I use. Unfortunately, the Nginx-plugins (nginx\_status and nginx\_request) are incorrectly documented. In the header of the plugins, one can read that the default URL is `http://localhost/nginx_status`, which certainly makes sense. The plugin even documents how one were to set this up. **However**, the plugin logic tells a different story. In nginx_requests, we can see that it relies on ‘hostname -f’ to look up the hostname that it connects to (which in 99.999% of all production servers isn’t ‘localhost’).

The fix however, is very easy. All you need to do is to add the URL to the Munin’s plugin configuration file. This can be done using the following command:

    if [[ $(cat /etc/munin/plugin-conf.d/munin-node | grep "nginx") = "" ]]; then echo -e "\\n\[nginx*\]\\nenv.url http://localhost/nginx_status" >> /etc/munin/plugin-conf.d/munin-node; fi

This can be run as many times as you’d like, as it only appends the config-snippet if it’s not there already.

In my case, I wanted to push this out using Puppet, so I have the following block in my Puppet Munin-module:

    package { 'munin-node':
    	ensure  => 'present',
    }

    service { 'munin-node':
    	ensure     => 'running',
    	hasrestart => 'true',
    	hasstatus  => 'true',
    	enable     => 'true',
    }

    file { 'nginx_request':
    	ensure  => 'link',
    	path    => '/etc/munin/plugins/nginx_request',
    	target  => '/usr/share/munin/plugins/nginx_request',
    	require => Package\['munin-node'\],
    }

    file { 'nginx_status':
    	ensure  => 'link',
    	path    => '/etc/munin/plugins/nginx_status',
    	target  => '/usr/share/munin/plugins/nginx_status',
    	require => Package\['munin-node'\],
    }

    # Fixes a bug in the plugin and configures it to poll using localhost
    exec { 'activate\_nginx\_munin':
    	command => 'bash -c if \[\[ $(cat /etc/munin/plugin-conf.d/munin-node | grep "nginx") = "" \]\]; then echo "\\n\[nginx*\]\\nenv.url http://localhost/nginx_status" >> /etc/munin/plugin-conf.d/munin-node; fi',
    	user    => 'root',
    	require => \[
    		File\['nginx_status'\],
    		File\['nginx_request'\],
    		\],
    	path    => \[
    		'/usr/sbin',
    		'/usr/bin',
    		'/sbin:/bin',
    	\],
    }

(I also use a Puppet-template for Munin’s config-file, but that’s beyond the scope of this article.)
