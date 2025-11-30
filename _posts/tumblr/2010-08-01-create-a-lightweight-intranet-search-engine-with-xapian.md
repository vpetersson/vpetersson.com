---
layout: post
title: Create a lightweight intranet search engine with Xapian on FreeBSD
date: '2010-08-01T23:42:50+03:00'
tags:
- FreeBSD
- Xapian
redirect_from: /post/92729920634/create-a-lightweight-intranet-search-engine-with-xapian
---

Recently I had to set up an intranet search engine to crawl trough thousands of PDF files. There are a ton of commercial solutions (read: $$$$

) out there on the market, ranging from [Google Search Appliance](http://www.google.com/enterprise/search/gsa.html) to [IBM’s OmniFind](http://omnifind.ibm.yahoo.net/). There are also a few good Open Source engines, such as [Apache’s Lucene](http://lucene.apache.org/java/docs/index.html). The problem is that these are primarily intended for enterprises with server farms full of data. That’s really not what I was looking for. I was looking something simple that was easy to set up and maintain. That’s when I came across [Xapian](http://xapian.org/). It’s Open Source and lightweight. Combine Xapian with [Omega](http://xapian.org/docs/omega/overview.html) and you got exactly what I was looking for — A lightweight intranet search engine.

This howto will walk you trough how to set up Xapian with Omega on FreeBSD. The version I used was FreeBSD 8.1, but I’m sure any recent version of FreeBSD (7.x>) will do. Please note that I do expect you to know your way around FreeBSD, so I’m not going to spend time on simple tasks like how to edit files etc. I also assume you already got your system up and running.

I’ve called the path we’re going to index (recursively) ‘/path/to/something’. This can be either a local path or something mounted from a remote server. Also, as you’ll see below, a lot of dependencies are installed. This is to increase the number of file-format Xapian will index. It should be able to index PDF-files, Word-files, RTF-files, in addition to plain-text files.

Let’s get started.

**Note**: If you don’t have the ports-tree installed (/usr/ports), you can download it by simply running:

    portsnap fetch extract

**Install Apache**

    /usr/ports/www/apache22  
    make install  
    echo -e “\\napache22_enable=\\”YES\\”” >> /etc/rc.conf

**Install Xapian with Xapian-Omega**

    cd /usr/ports/www/xapian-omega  
    make install

**Install Xpdf**\
Make sure to uncheck X11 and DRAW

    cd /usr/ports/graphics/xpdf  
    make install

**Install Catdoc**\
Uncheck WORDVIEW

    cd /usr/ports/textproc/catdoc  
    make install

**Install Unzip**

    cd /usr/ports/archivers/unzip  
    make install

**Install Gzip**

    cd /usr/ports/archivers/gzip  
    make install

**Install Antiword**

    cd /usr/ports/textproc/antiword  
    make install

**Install Unrtf**

    cd /usr/ports/textproc/unrtf  
    make install

**Install Catdvi**

    cd /usr/ports/print/catdvi  
    make install

Next we need to edit Apache’s config-file (/usr/local/etc/apache22/httpd.conf)

Change:

    ScriptAlias /cgi-bin/ “/usr/local/www/apache22/cgi-bin/”

Into:

    ScriptAlias /cgi-bin/ “/usr/local/www/xapian-omega/cgi-bin/”

We also need to create a new config-file for Xapian. Create the file /usr/local/etc/apache22/Include/xapian.conf

        Alias /something /path/to/something

                Options Indexes
                AllowOverride None
                Order allow,deny
                Allow from all

            AllowOverride None
            Options None
            Order allow,deny
            Allow from all

With all Apache configuration being done, let’s fire up Apache:

    /usr/local/etc/rc.d/apache22 start

Create the holding directory

    mkdir -p /usr/local/lib/omega/data/

Copy over the templates. For some reason FreeBSD doesn’t do this by default.

    cp -rfv /usr/ports/www/xapian-omega/work/xapian-omega-*/templates /usr/local/lib/omega/

We also need to tell Xapian-Omega where to look for the files. Create the file /usr/local/www/xapian-omega/cgi-bin/omega.conf

    \# Directory containing Xapian databases:  
    database_dir /usr/local/lib/omega/data

    \# Directory containing OmegaScript templates:  
    template_dir /usr/local/lib/omega/templates

    \# Directory to write Omega logs to:  
    log_dir /var/log/omega

    \# Directory containing any cdb files for the $lookup OmegaScript command:  
    cdb_dir /var/lib/omega/cdb

Create a search page. I’ll just use index.html in Apache’s default DocumentRoot (/usr/local/www/apache22/data/index.html).

    Match any word
    Match all words
