---
slug: introducing-natpass
title: Introducing NatPass
date: '2015-10-01T23:13:18+03:00'
tags:
- natwest
- python
- banking
- 1password
aliases: /post/130291303584/introducing-natpass
---

After moving to London, I decided to go with [NatWest](http://www.natwest.com) as my bank. While it was a good experience at large, their online banking leavs a lot to be desired. Not only do they lack things like Two-Factor Authenciation (2FA), but they also have this _really_ frustrating login system.

Well, today I had enough and whipped up a CLI tool that allows you to generate the data that they ask for by reading it in from 1Password (using [1pass](https://pypi.python.org/pypi/1pass/0.2.1)).

The result is a tool called [NatPass](https://github.com/vpetersson/natpass). It will save me lots of frustration, and hopefully it will save someone else the same frustration.
