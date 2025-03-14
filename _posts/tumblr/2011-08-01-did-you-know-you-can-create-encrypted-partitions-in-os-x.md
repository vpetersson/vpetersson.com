---
layout: post
title: Did you know you can create encrypted partitions in OS X Lion?
date: '2011-08-01T12:00:46+03:00'
tags:
- Encryption
- OS X
redirect_from: /post/92729948399/did-you-know-you-can-create-encrypted-partitions-in-os-x
---

The most exciting new feature in OS X Lion for all paranoid techies out there was the introduction of full-disk encryption (FileVault 2). The previous version of FileVault only enabled you to encrypt your home directory. That was a good start, but it forced you to log out once in a while to recover disk space. This was extra painful if you were using a small SSD-drive.

Another issue with FileVault 1 was that it prevented you to effectively use Time Machine. In order to backup your home directory, you had to log out. First then would Time Machine back up your files. This was inconvenient to say the least.

On the topic of Time Machine, OS X Lion also introduced a new feature when it comes to Time Machine. You can now encrypt your backups. That’s great, as if you were to use FileVault 2 and Time Machine without encryption, your backups would be entirely unencrypted.

As I was setting up my encrypted Time Machine-drive, I took a closer look how this was done. As it turns out, Time Machine is using a new partition type in OS X Lion to accomplish this. What’s even better is that you can do this on any drive.

All you need to do is to re-format the partition in Disk Utility, and select ‘Encrypted.’\
![](http://viktorpetersson.com/wp-content/uploads/2011/08/encrypt.png "encrypt")\
Now you can easily encrypt all your external drives, while making it entirely seamless for day-to-day operations. If you chose to store the passphrase in your keychain, you won’t even notice that the disk is encrypted (other than perhaps less I/O throughput and more CPU usage).
