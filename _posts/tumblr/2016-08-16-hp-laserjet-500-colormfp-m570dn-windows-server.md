---
layout: post
title: HP LaserJet 500 colorMFP M570dn, Windows Server 2012 r2 and Offline mode
date: '2016-08-16T10:50:36+03:00'
tags:
- Windows
- note to self
- printers
redirect_from: /post/149023688109/hp-laserjet-500-colormfp-m570dn-windows-server
---

(I try hard to stay away from Windows environments, but sometimes it’s unavoidable.)

Recently I ran across a strange issue with a HP LaserJet 500 colorMFP M570dn. The printer worked great for years, then all of the sudden, it started to act up. Applying the latest firmware didn’t solve the issue, so it started probing.

The issue was that the printer randomly went into _Offline mode_, blocked all users from printing.

After some probing, it turns out that the issue was related to [SNMP](https://social.technet.microsoft.com/Forums/office/en-US/80b06f0d-3b81-4cc6-95ad-aabc781d1eb0/printers-offline-in-windows-2008-r2?forum=winserverprint). In short, Windows tries to determine if the printer is offline using SNMP. This apparently is a [common issue](http://blog.rtwilson.com/how-to-fix-a-network-printer-suddenly-showing-as-offline-in-windows-vista/).

I first struggled with some strange permission issues in Windows to toggle this SNMP setting, but I fortunately found [this guide](http://blacktheman.blogspot.se/2011/11/access-denied-message-when-changing.html) on how to work around the issue.
