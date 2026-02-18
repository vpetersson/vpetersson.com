---
slug: how-to-get-bittorrent-sync-to-stop-syncing-finder
title: How to get BitTorrent Sync to stop syncing Finder meta data
date: '2014-10-31T20:34:10+02:00'
tags:
- BittTorrent Sync
- backup
- backup software
- os x
aliases: /post/101437364464/how-to-get-bittorrent-sync-to-stop-syncing-finder
---

I really like [BitTorrent Sync](https://www.btsync.com/en/). It’s a great alternative to Dropbox et al, without having to hand over your unencrypted data to a third party.

Unfortunately, the default configuration in BitTorrent Sync for Mac OS X is somewhat odd. As it turns out, it syncs all of Finder’s meta data. As you can imagine, this means a lot of pointless syncing.

After [posting](http://forum.bittorrent.com/topic/32376-ignorelist-isnt-honored-by-the-sending-node/) on the forum, I did however [found out](http://sync-help.bittorrent.com/customer/portal/articles/1682051-alt-streams-and-xattrs-in-sync) that by default these files are added to a file called `StreamsList` that apparently overrides the more obvious `IgnoreList`.

Why these files are listed in there beats me, but after removing them from there, my nodes stopped syncing like crazy all the time.
