---
layout: post
title: Puppet on Ubuntu 10.04
date: '2011-12-18T13:44:56+02:00'
tags:
- Chef
- Puppet
- Ubuntu
redirect_from: /post/92729952849/puppet-on-ubuntu-10-04
---

Yesterday I decided that it’s about time to learn [Puppet](http://puppetlabs.com/). I’ve had my eye on both Puppet and [Chef](http://wiki.opscode.com/display/chef/Home) for some time now. Yesterday after reading this [Quora](http://www.quora.com/What-are-the-key-reasons-to-choose-Puppet-over-Chef-or-vice-versa)-thread and this [blog](http://devopsanywhere.blogspot.com/2011/10/puppet-vs-chef-fight.html)-post, I decided to go with Puppet.

After downloading their test-VM and going through the [tutorial](http://docs.puppetlabs.com/learning/), I pretty quickly fell in love with the simplicity and structure. Puppet is straight forward and rather intuitive.

One of the architectures that I wanted to deploy Puppet on was running Ubuntu 10.04 LTS. Unfortunately, the version from Ubuntu’s repository is really old (0.25.4), and not really compatible with much of the cool things you can do with Puppet.

Fortunately, PuppetLabs do provide their own repository, but the instructions for adding this repo wasn’t really at par with the rest of their excellent documentations — hence this post.

If you’re a die-hard Ubuntu/Debian-fan, this is probably pretty straight-forward, but if you’re not, here is what you need to do:

    sudo su - 
    echo -e "deb [http://apt.puppetlabs.com/ubuntu](http://apt.puppetlabs.com/ubuntu) lucid main\\ndeb-src [http://apt.puppetlabs.com/ubuntu](http://apt.puppetlabs.com/ubuntu) lucid main" >> /etc/apt/sources.list
    apt-key adv --keyserver keyserver.ubuntu.com --recv 4BD6EC30
    apt-get update
    apt-get install puppet

Ok, so that was pretty straight forward. The only tricky part was importing the keys, but now you know how to do that too.
