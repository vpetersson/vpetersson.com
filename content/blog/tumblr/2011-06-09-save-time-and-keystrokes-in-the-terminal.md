---
slug: save-time-and-keystrokes-in-the-terminal
title: Save time (and keystrokes) in the terminal
date: '2011-06-09T23:31:24+03:00'
tags:
- Linux
- Mac OS X
- Unix
aliases: /post/92729946829/save-time-and-keystrokes-in-the-terminal
---

Do you have a few long commands that you keep typing in the terminal? Things like ‘cd /some/long/path/that/takes/forever/to/type’ or ‘mycommand -with -lots -of -variables’?

If so, here’s something you’ll enjoy.

Just open up ~/.profile in your favorite editor, and add the following lines:

    alias foo="cd /some/long/path/that/takes/forever/to/type"
    alias bar="mycommand -with -lots -of -variables"

Now you don’t need to type those long commands ever again. All you need to do is to typ ‘foo’ or ‘bar’. You can of course replace foo and bar with anything you want, as well as the command.
