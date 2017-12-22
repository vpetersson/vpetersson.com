---
layout: post
title: Hello Grub, you suck!
date: '2010-05-14T15:59:43+03:00'
tags:
- Grub
- Lilo
- Ubuntu
permalink: /post/92729914274/hello-grub-you-suck
---
In the last few weeks I had to set up a few new Linux servers. Since Ubuntu is my preferred Linux dist in recent years, 10.04 LTS was a natural choice.

Ubuntu 10.04 LTS is a great Linux distribution, with one exception: Grub. I really mean it. Grub is probably the worst boot loader to date. Is so bad that it could equally well be replaced with the following shell script:

`  
echo ""  
sleep 10  
`

The better alternative to Grub is obviously Lilo. While it may be obsolete, poorly updated and 20 years old, it does one thing that Grub doesn’t: it works. Personally I couldn’t care less about fancy splash screens and all the bells and whistles that Grub can put on it’s repertoire. It’ doesn’t matter when it cannot boot the system. Please Ubuntu, just ditch Grub and make Lilo the default boot loader.
