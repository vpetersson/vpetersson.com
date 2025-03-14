---
layout: post
title: Implementing ASSP with Postfix on FreeBSD
date: '2010-12-14T23:15:54+02:00'
tags:
- ASSP
- e-mail
- FreeBSD
- Postfix
- SMTP
- Spam
redirect_from: /post/92729939994/implementing-assp-with-postfix-on-freebsd
---

In this article, I will walk you through the process of setting up [ASSP](http://assp.sourceforge.net/). If you’ve never heard of ASSP, it is a great anti-virus and spam-fighting proxy that sits in front of your SMTP server. Under the hood, ASSP includes a lot of intelligent spam logic, but you won’t really have to worry about it. All you really need to know is that it great at fighting spam and that it is easy to set up.

In this article I assume that you already got Postfix in place, but you can use ASSP with any other SMTP server, as it simply sits as a proxy between the user and the SMTP server. In essence, what you need to do is to re-bind your SMTP server to another port (eg. 125) or IP (eg. 127.0.0.1) and have ASSP listen on the public interface and relay the messages to your SMTP server.

Let’s get started.

### Install ASSP

We start by installing ASSP. Since this guide is for FreeBSD, we will use the ports-system. However, if you’re on a different platform, you can simply install ASSP from source.

> cd /usr/ports/mail/assp/\
> make install

Enable ASSP and Clamav by adding the following to /etc/rc.conf

> clamav\_clamd\_enable=”YES”\
> clamav\_freshclam\_enable=”YES”\
> assp_enable=”YES”

Add your domains from Postfix to ASSP:

> postconf | grep -e ^virtual\_alias\_domains.* -e ^mydestination.* | perl -pe “s/^(mydestination|virtual\_alias\_domains)\\s=\\s(.*)$/\\2/g; s/\\s/\\n/g;” > /usr/local/share/assp/files/localdomains.txt

(This simply extract the settings from Postfix and insert them to ASSP)

Now start the two services:

> /usr/local/etc/rc.d/assp start\
> /usr/local/etc/rc.d/clamav-clamd start\
> /usr/local/etc/rc.d/ clamav-freshclam start

### Configure ASSP

Now we need to make some changes to ASSP. By default, ASSP’s webserver listen on port 55555, so you need to point your browser to your server and this port. (eg. http://yourhostname:55555).

The default username is root and the password is ‘nospam4me’

Go ahead and make the following changes:

- Second SMTP Listen Port: 587
- All TestModes ON: True

You need this set for about a week while you train ASSP.

- Prepend Spam Subject: \[Spam\]
- Accept All Mail: The IP or hostname of your server
- Local Domains: file:files/localdomains.txt
- Local Domains,IPs and Hostnames: The IP or hostname of your server
- Use ClamAV: True
- Modify ClamAV Module: False
- Port or file socket for ClamAV: /var/run/clamav/clamd.sock
- Web Admin Password: Your password

Press ‘Apply changes’.

### Modify Postfix

When you’re happy with your ASSP configuration, we need to modify your SMTP server to listen on a different port (in this case, port 125). If you are using Postfix, open /usr/local/etc/postfix/master.cf and change the line:

> smtp inet n – n – – smtpd

to

> 125 inet n – n – – smtpd

You also need to comment out the following line by simply adding a ‘#’ to the beginning of the line.

> submission inet n – n – – smtpd

Now we need to restart both Postfix and ASSP to apply the changes (the sequence here is important):

> /usr/local/etc/rc.d/postfix restart\
> /usr/local/etc/rc.d/assp restart

Verify that all the services are running with

> sockstat -4l | grep -e 25 -e 125 -e 587

If not, take a look in the following log-files:

- `/var/log/maillog`
- `/var/log/assp/maillog.txt`

### Training ASSP

Once you got ASSP up and running, you are likely to get a lot of valid emails marked as spam the first days. That’s normal. ASSP needs some training. If you run across a message that was marked as spam but was indeed a valid message, simply forward it to **assp-notspam@assp.local**. In a similar fashion, if you run across a spam message that ASSP failed to detect as spam, simply forward it to **assp-spam@assp.local**.

After about a week or so of training (depending on your volume), you can go ahead and disable ‘All TestModes’ in the web interface.

Good luck!
