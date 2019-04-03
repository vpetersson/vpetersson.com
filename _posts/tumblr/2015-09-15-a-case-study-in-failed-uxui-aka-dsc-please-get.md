---
layout: post
title: A case study in failed UX/UI  (aka DSC please get your shit together)
date: '2015-09-15T21:22:17+03:00'
tags:
- dsc
- DLS
- alarm system
- home alarm
- fail
redirect_from: /post/129162297409/a-case-study-in-failed-uxui-aka-dsc-please-get
---
Dear Digital Security Controls (DSC),

I recently purchased your [T-link](http://www.dsc.com/index.php?n=products&o=view&id=143) extension (IP module) for two alarm systems that I wanted to be able to remotely manage. After a few hours of troubleshooting (read: having to install Windows XP), I am now able to connect to these alarm systems over a VPN connection, but that’s about it.

Please take a look at this screenshot:

![DSC DLS alarm software](/tumblr_files/tumblr_inline_nuqfgtj0GQ1skxjxc_540.png)

If it isn’t obvious what is wrong with this, let me spell this out for you.

*   Your software only runs on Windows XP. Nope, not even Windows 7. Forget about a modern web interface like most people have come to expect in this day and age from an ‘IP module’.
*   Your client software requires SQL Server Express (ehh WTF?!).
*   Throughout the entire app, you use the industry standard icon that means 'refresh’ for 'Restore all options as to original’. I just almost hit this icon when I was about to reload the values.
*   In a client software _download_ means just that, down load (i.e. fetching to your local computer) and _upload_ means to upload from the computer to whatever device/service you’re intereacting with. In your software, you’ve apparently decided to call them the other way around (which is very confusing).
*   The user interface is confusing to say the least. I’ve worked with a few different alarm systems in the past. They’ve all been ranging from crappy to less crappy, but this one takes the price. After spending a good 15 minutes, I still have _no_ idea how to perform even basic tasks (like user management, set PIN codes, look at events etc).

I could go on and on about this, but really, I don’t have enough energy. Anyone with _any_ UI/UX experience can show you. I’m just severely disappointed that some has the stomach to sell something this poorly designed in this day and age. It should barely be classified as a Minimum Viable Product (MVP).

If you want to be in the software space, please hire people who are actually qualified for the task.

Yours truly,  
A one-time customer
