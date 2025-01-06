---
layout: post
title: Introducing Puppet-hosting -- host websites with sanity
date: '2013-02-03T22:21:00+02:00'
tags:
- Linux
- Nginx
- Puppet
- Ubuntu
redirect_from: /post/92729974319/introducing-puppet-hosting-host-websites-with-sanity
---
Since we started WireLoad, the number of websites we host have grown steadily. It’s a myriad of sites, ranging from product sites to websites belonging to friends and family. Many of them are WordPress-sites (just like this one), while others are more complicated. Some use databases, while others don’t. Since we’re often in a rush when we set up a site, documentation often suffers, and you have to spend time later on trying to decipher how things were set up.

This past week I finally had enough and decided to resolve this issue once and for all. What we really needed was a template-based system that could take care of everything and provide us with a user friendly interface. Puppet felt like the best tool for the job so I got busy writing a custom module for this.

The final result is a module I named [Puppet-hosting](https://github.com/vpetersson/puppet-hosting). It allows you to manage all your websites using Puppet. To add a new site, all you need to do is to add a few lines to in your site.pp, and you’re all set.

Here’s an example of how it can look:

    hosting::site { 'My Website':
      type        => 'wordpress',
      url         => 'mysite.net',
      url_aliases => ['mysite.*', 'www.mysite.net'],
      ip          => $ipaddress_eth0,
      contact     => 'Viktor Petersson ',
    }
    

Not only does this make it much easier to manage all the sites, it also speeds things up and avoids human errors, such as typos (and if you do have a typo, it’s easy to spot, since it’s only a few lines in sites.pp).
