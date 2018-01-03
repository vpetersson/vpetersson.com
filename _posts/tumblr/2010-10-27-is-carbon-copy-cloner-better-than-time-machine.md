---
layout: post
title: Is Carbon Copy Cloner better than Time Machine?
date: '2010-10-27T20:43:32+03:00'
tags:
- Carbon Copy Cloner
- Mac OS X
- Time Machine
redirect_from: /post/92729929934/is-carbon-copy-cloner-better-than-time-machine
---
When Apple announced Time Machine, I was overwhelmed and thought it was the best invention since sliced bread. I’ve been using it since then in setups both with a dedicated external hard drive and a Network Attached Storage (NAS).

Lately though, I’ve started to get more and more annoyed with Time Machine. It consumes a significant amount of resources, as it keeps backing up changes continuously, and it will fill up the destination drive until it’s full.

Another great thing with Time Machine is the ability to simply recover a backup within the OS X installer. Simply boot up on the installation disk and pick the Time Machine drive, and off you go. That’s pretty awesome.

Unfortunately, the recovery takes many, many hours. I’m fine with the fact that it takes sme time to copy my 200GBish backup over a gigabit network, right now my I’m staring at a screen saying the estimated time remaining as 26 hours. That’s just bizarre. No, the NAS is not that slow, I can easily copy files from the NAS in ~20MB/sec. Yes, I know there are plenty of small files in the backup, but that doesn’t explain this slow speed.

I’ve done recoveries in the past from external drives, and I was equally surprised back then that the backup took that long.  
  
As I was sitting there staring at the screen, I pulled up my iPad trying looking for alternative solutions, I found [Carbon Copy Cloner](http://www.bombich.com/). It’s a free software from Bombich Software, and enables you to clone two drives within OS X (even the one that you booted from). It even allows you to schedule syncs. Since the software literally clones the drive, you can simply boot off of the backup drive (assuming it is formatted with GUID and HFS+).

Upon finding this out, I started thinking: perhaps Carbon Copy Cloner is better than Time Machine. Simply hook up an external drive to your machine, create a partition of the same size as your local drive, and schedule it to sync every night. If your primary disk fails, you can just boot off of the cloned drive and literally have zero downtime. You don’t have to waste 12-24h recovering a Time Machine backup.

There are obviously some drawbacks. First, it doesn’t back up continuously. It only back ups as often as you schedule it to do. Second, you cannot recover files in the same fashion as you can with Time Machine, i.e. you cannot recover a file in a given folder from 4 months ago.

Yet, you will not waste I/O bandwidth during your workday on running backups.

I’m not sure if it is better than Time Machine, and quite frankly, it probably depends on your usage pattern. I cannot recall the last time I entered Time Machine to recover a file from months ago, but I can recall plenty of time where I’ve been annoyed with Time Machine for consuming my I/O bandwidth when I needed it myself. Hence Carbon Copy Cloner might be a better fit for me.
