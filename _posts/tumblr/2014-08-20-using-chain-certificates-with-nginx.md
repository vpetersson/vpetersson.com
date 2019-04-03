---
layout: post
title: Using chain certificates with Nginx
date: '2014-08-20T09:52:47+03:00'
tags:
- Namecheap
- nginx
- devops
- note-to-self
redirect_from: /post/95265939219/using-chain-certificates-with-nginx
---
I’m a big fan of [Namecheap](http://namecheap.com). They offer cheap SSL certificates that does the trick just fine. For most my projects, I go for their cheapest option (usually ‘PossitiveSSL’).

Every time I deploy one of these certificates however, I screw up the order of the chain certificates. The tl;dr is that certificate should go first, and then the supporting chain certificates.

After extracting the zip-file you get from Namecheap, simply run this command to create your certificate:

    $ cat STAR_*.crt AddTrust*.crt COMODORS*.crt  > foobar.com.crt
