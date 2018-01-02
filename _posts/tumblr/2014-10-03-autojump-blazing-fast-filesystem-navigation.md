---
layout: post
title: 'Autojump: blazing fast filesystem navigation'
date: '2014-10-03T10:22:00+03:00'
tags:
- bash
- osx
- DevOps
- shell
- terminal
permalink: /post/99041141869/autojump-blazing-fast-filesystem-navigation
---
[Autojump: blazing fast filesystem navigation](https://github.com/joelthelion/autojump)  

> autojump - A cd command that learns - easily navigate directories from the command line

I just ran across a very convenient little tool called `autojump` that I wanted to share.

For a number of years, i’ve used aliases in Bash for quickly navigating the file system. `autojump` makes this unnecessary.

OS X crash course
=================

This requires that you have `brew` installed and use Bash as your shell

Installation
------------

    brew install autojump
    echo '[[ -s `brew --prefix`/etc/autojump.sh ]] && . `brew --prefix`/etc/autojump.sh' >> ~/.bash_profile 
    source ~/.bash_profile
    

Usage
-----

    cd /path/to/my-project
    j my-project
    

Please note that you need to `cd` into the directory before it appears in the index.
