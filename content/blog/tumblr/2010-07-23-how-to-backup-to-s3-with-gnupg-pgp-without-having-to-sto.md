---
slug: how-to-backup-to-s3-with-gnupg-pgp-without-having-to-sto
title: How to backup to S3 with GnuPG (PGP) without having to store the passphrase
  locally
date: '2010-07-23T13:25:23+03:00'
tags:
- AWS
- backup
- GnuPG
- PGP
- S3
- s3cmd
aliases: /post/92729918934/how-to-backup-to-s3-with-gnupg-pgp-without-having-to-sto
---

To increase the reliability of our backups at WireLoad, we wanted to utilize S3. Obviously we couldn’t just send our backups to S3 without encrypting them, so GnuPG was part of the equation from the beginning. As I started my research, I found a ton guides on how to utilize a variety of backup tools to get your backups delivered to S3. Some of the tools looked really promising. After reading the specs, [Duplicity](http://duplicity.nongnu.org/) stood out as the winner. It supported S3, encryption and the whole shebang. It even supported incremental backups. Bingo I thought. That’s perfect.

That said, I installed Duplicity on a test-server and started experimenting with it. As I’m fairly familiar with GnuPG and PGP encryption, I reckoned that the ideal setup would be the standard public/private key structure and only have the public key installed on the server. The private key would be stored elsewhere. So far so good, Duplicity asked for the public key in its configure, but it still asked for the passphrase when running. Surely, you could store the passphrase in plain text and parse it to Duplicity, but that’s kind of pointless, as it defeats the purpose of a passphrase.

Now you may say ‘Hey! you probably already store the backups without encryption anyways, so what’s the point?’ The point is that there could be backups from other servers stored in the S3 bucket. If you save the passphrase (and somehow gets your hand on the private key), these are all compromised too. If you were instead able to encrypt the backup just using the public key, without the passphrase, these backups would be a lot more secure.

As it turns out, that is possible with GnuPG — just not with Duplicity (AFAIK). The key is to encrypt the backups with the public key as the ‘recipient.’ I’m not going to tell you how to get up and running with GnuPG (see [this page instead](http://www.gnupg.org/gph/en/manual/c14.html)).

Assuming you’ve installed the public key (gpg –import your-public-key), all you need to for encrypting a file without entering the passphrase is as follows:

    gpg –encrypt –recipient ‘the-email-in@your-key.net’ filename

Pretty easy, right?

If we want to pull that into a script, we just need [s3cmd](http://s3tools.org/s3cmd) to the mix, and we’re pretty much all set. You will also need to configure s3cmd (s3cmd –configure) with your AWS information.

Here’s the script I ended up with. Please note that the path I backup only includes achieves generated from another backup script. Also, the archive only includes files with the extension tbz, bz2 and tar. I’m sure you could play with s3cmd’s ‘rexclude’ feature to write a pretty RegEx, but it wasn’t worth the time for me.

    #!/bin/sh

    \# Path to backup  
    BACKUP=/path/to/backup/archive

    for i in \`find $BACKUP -type f | grep -v .gpg\`  
    do gpg –batch –encrypt –recipient ‘the-email-in@your-key.net’ $i  
    done

    \# S3 only allows 1GB files. To resolve that we use ‘split’ to break files larger than 1GB apart.  
    \# When done splitting, we truncate the original file to save diskspace. We cannot delete it, as gpg will then re-create it next run.  
    for j in \`find /path/to/backup/archive -size +1G |grep gpg\`;  
    do  
    split -a 1 -b 1G $j $j-  
    truncate -s 0 $j  
    done;

    s3cmd sync -r $BACKUP –exclude=’.tbz’ –exclude=’.bz2′ –exclude=’.gz’ s3://your-bucket/\`hostname -s\`/

Enjoy. If you have any comments, please let me know.

**Update:** Added ‘split’ to work around S3′s 1GB file limitation.
