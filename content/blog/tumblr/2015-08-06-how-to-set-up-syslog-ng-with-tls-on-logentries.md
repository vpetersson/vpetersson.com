---
slug: how-to-set-up-syslog-ng-with-tls-on-logentries
title: How to set up syslog-ng with TLS on Logentries
date: '2015-08-06T13:50:29+03:00'
tags:
- syslog-ng
- linux
- logging
- syslog
- devops
- ubuntu
- debian
aliases: /post/126006528524/how-to-set-up-syslog-ng-with-tls-on-logentries
---

After using Loggly for a few years, I stumbled across [Logentries](https://logentries.com/learnmore?code=82a5c804) (disclosure: referral link). What I was looking for was basically something that is more affordable when the volume increases, and Logentries is a lot more affordable than Loggly as you grow.

If you are just starting out using a remote shipping target (be Loggly, Papertrail or Logentries), it is worth noting that if you simply follow the instructions **you will be shipping logs in plain text**. Since you’re a smart cookie, you know that’s a very bad idea.

The good news is that most services (at least the three mentioned) do support encryption, but it takes a bit more work. What I did find however was that the instructions for Logentries in particular were pretty bad, so I decided to share this with you to save you the effort it took me to get this working with syslog-ng.

## Step 1: Fetch the certificates

This was surprisingly challenging with Logentries. While they openly announce that they support encryption, the links to **where you can find said certificates** wasn’t as obvious. Long story short, you can find them [here](https://logentries.com/doc/certificates/). Unfortunately, they do simply give you a URL, but instead encourage you to copy and paste the certs by hand (which is of course far more error prone).

The certificates that you need are the ones under ‘API certificate’.

Go ahead and save the first certificate as `api.crt` and the intermediate certificate as `intermediate.crt`.

In theory, you should now verify the hashes, but I wasn’t able to get mine to match, so perhaps they’ve simply forgot to update the hashes. If it’s to any help, this is what I got:

    $ md5 *.crt
    MD5 (api.crt) = 9107ba5545a000ea06cd5fd046102c14
    MD5 (intermediate.crt) = 413a2acb5b07cd49cbf916eefcf3ba33

(Please note that this of course will change whenver Logentries updates their certificates.)

With these certificates, we now need to generate a combined certificate that we’ll ship to the nodes. To do this, simply run:

    $ cat {intermediate.crt,api.crt} > logentries_full.crt

If you’re lazy, you can also fetch mine from [here](https://gist.githubusercontent.com/vpetersson/e9965d8e27aa0a2a71c7/raw/c911ec6bb11c4866ff7c8cdc01052d8998887bf2/gistfile1.txt).

The md5sum for this certificate should be:

    $ md5 logentries_full.crt
    MD5 (logentries_full.crt) = 3918fcd927bb98fa2c23a46e5a4b7820

(Again, this will of course also change whenver Logentries updates their certificates.)

Now create the directory `/etc/syslog-ng/keys/ca.d/` on the host and copy `logentries_full.crt` certificate there.

## Step 2: Configure syslog-ng

With the certificate in place, the last step is to create the config file. My preference is to use the `conf.d` folder for this (which already exists on Debian/Ubuntu installations).

Now create the file `/etc/syslog-ng/conf.d/22-logentries.conf` and populate it with the following data:

    template logentriesTemplate {
      template("YOURTOKEN $ISODATE $HOST $PROGRAM $MSG\n");
      template_escape(no);
    };

    source s_all {
      unix-stream("/dev/log");
    };

    destination d_network_logentries {
      tcp("api.logentries.com"
        port(20000)
        tls(peer-verify(required-untrusted) ca_dir("/etc/syslog-ng/keys/ca.d/"))
        template(logentriesTemplate)
      );
    };

    log {
      source(s_all); destination(d_network_logentries);
    };

Replace YOURTOKEN with the actual token from Logentries. You also might change some elements in this file to better fit your needs, but what’s important here is the destination-block, which is what is dealing with the TLS aspect.

With the file in place, restart syslog-ng and you should be good to go.

## Troubleshooting

If you’re having issues getting this started, the first thing to do is to check the actual logs. There should be a line similar to this if it worked:

    Syslog connection established; fd='11', server='AF_INET(a.b.c.d:20000)', local='AF_INET(0.0.0.0:0)'

You might also want to sniff the traffic to verify that the traffic sent out actually is encrypted. You can do that easily with `tcpdump` as follows:

    $ tcpdump -A dst api.logentries.com

Happy hacking!
