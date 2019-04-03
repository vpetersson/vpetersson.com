---
layout: post
title: Moving Cyrus from a 32Bit to a 64Bit server
date: '2010-10-03T22:52:12+03:00'
tags:
- Cyrus
- FreeBSD
redirect_from: /post/92729927834/moving-cyrus-from-a-32bit-to-a-64bit-server
---
I’ve you’ve read the past few articles I’ve published, you’ve probably figured out two things:

*   I love FreeBSD.
*   I’m in the process of moving a bunch of servers.

This time I’ll walk you trough how to move [Cyrus-IMAP](http://www.cyrusimap.org/) between a 32bit server to a 64bit server. In my case, on FreeBSD. Unfortunately the process is not as straight-forward as I imagined it to be. With these instructions, you will hopefully save yourself the hours I spend troubleshooting the issue.

My first approach was to simply copy all the data from the old server to the new one. That didn’t quite do the trick. Cyrus wouldn’t launch properly, as it could not read the 32bit data properly. After some research I found out that the problem is Cyrus’ internal database is locked for the given architecture. Therefor you need to rebuild the data on the 64bit server.

Here’s the full approach I took, step-by-step. I will assume that you have your configdirectory set to /var/imap and partition-default to /usr/imap. If not, you’ll have to adjust that below. I also assume that you’ve copied your Cyrus config files (imapd.conf and cyrus.conf) across ahead of time.  

### Initial sync

We start by sync the data between the two servers without shutting down Cyrus.

On the old server, run:

    rsync -aP /var/imap root@mynewserver:/var/  
    rsync -aP /usr/imap root@mynewserver:/usr/

This will copy all data across without you having to shut down Cyrus (ie no downtime). If you have a large mail storage, this can take some time. Please note that you need to run the command above as ‘root’ (or some other user with full read-permission to the data).

### Final sync

With the initial sync done, we have most of the data copied. We only need to do a final sync with Cyrus shut down. Hence, the first step is to shut down Cyrus on both sides. With Cyrus **shut down** on both servers, run the following on the source server:

    rsync -aP –delete /var/imap root@mynewserver:/var/  
    rsync -aP –delete /usr/imap root@mynewserver:/usr/

The final step on the source server is to extract the mailbox list. To do that, run the following:

    sudo -u cyrus /usr/local/cyrus/bin/ctl_mboxlist -d > ~/mboxlist.txt  
    scp ~/mboxlist.txt root@mynewserver:/root/

### Final tweaks on the new server

This is the part that took me time to find. Namely the database issues that occur when switching from 32bit to 64bit. Here are the commands that will recreate the various databases. On the new server, run:

    sudo -u cyrus rm /var/imap/db/* /var/imap/db.backup1/* /var/imap/db.backup2/* /var/imap/deliver.db /var/imap/tls_sessions.db /var/imap/mailboxes.db  
    sudo -u cyrus /usr/local/cyrus/bin/ctl\_mboxlist -u sudo -u cyrus /usr/local/cyrus/bin/ctl\_cyrusdb -r  
    sudo -u cyrus /usr/local/cyrus/bin/tls_prune  
    sudo -u cyrus /usr/local/cyrus/bin/ctl_cyrusdb -c  
    sudo -u cyrus /usr/local/cyrus/bin/cyr_expire -E 3

When you’ve executed all of those commands, you should be able to launch Cyrus successfully. Also, if you’re not on FreeBSD, you might need to change the path to the binaries.

Good luck!

**Credits**: [Bill. C](http://www.mail-archive.com/info-cyrus@lists.andrew.cmu.edu/msg38092.html) on the Cyrus mailinglist.
