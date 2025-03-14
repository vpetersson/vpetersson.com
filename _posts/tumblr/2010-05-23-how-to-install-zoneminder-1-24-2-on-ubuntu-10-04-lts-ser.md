---
layout: post
title: How to install ZoneMinder 1.24.2 on Ubuntu 10.04 LTS Server
date: '2010-05-23T17:18:32+03:00'
tags:
- Linux
- Ubuntu
- ZoneMinder
redirect_from: /post/92729916079/how-to-install-zoneminder-1-24-2-on-ubuntu-10-04-lts-ser
---

Last week I published a new version of my [ZoneMinder Virtual Appliance](http://viktorpetersson.com/open-source/zoneminder-virtual-appliance). The virtual appliance is great if you want to easily deploy ZoneMinder without having to spend time setting it up. However, in some situations, you want to run ZoneMinder directly on the hardware. Perhaps you need better performance or simply need to capture video streams from V4L-devices.

Since I already spent the time getting it running, I thought I’d share the instructions for getting it running. It’s pretty straight forward, but there are a few minor things that took me some time to get around.

    \[flickr-gallery mode=“photoset” photoset=“72157624119100112”\]

# Installation

**Optional:** I personally prefer to install the ‘minimal’ version of Ubuntu. You can install this mode by simply hitting F4 right at boot.

Other than the installing the ‘minimal’ system, the only things you would need to keep in mind are to install “LAMP” and “OpenSSH” under the Software selection. You will also need to pick a MySQL password, which will be used later.

# Configuration

Upgrade the package repository:

    sudo apt-get update && sudo apt-get upgrade

Install all required dependencies:

    sudo apt-get install build-essential ffmpeg libmysqlclient-dev libjpeg-dev libssl-dev libdate-manip-perl wget liblwp-useragent-determined-perl libavformat-dev libphp-serialization-perl libswscale-dev joe

Get Zoneminder:

    wget [http://www.zoneminder.com/downloads/ZoneMinder-1.24.2.tar.gz](http://www.zoneminder.com/downloads/ZoneMinder-1.24.2.tar.gz)

Extract Zoneminder and change permission:

    sudo tar xvfz ZoneMinder-1.24.2.tar.gz -C /usr/local/
    sudo chown -R $(whoami) /usr/local/ZoneMinder-1.24.2

Configure Zoneminder:

    cd /usr/local/ZoneMinder-1.24.2
    ./configure --with-webdir=/var/www/zm --with-cgidir=/usr/lib/cgi-bin/ --with-webuser=www-data --with-webgroup=www-data ZM\_DB\_USER=zm ZM\_DB\_NAME=zm ZM\_DB\_PASS=yourpassword ZM\_SSL\_LIB=openssl

Resolve a bug (discussed more [here](http://www.zoneminder.com/forums/viewtopic.php?p=55152)):

    joe src/zm_utils.cpp

(or your favorite editor)\
Add the line ‘#include ‘ on row 22 (or somewhere in that general area). To exit and save with Joe, press _ctrl+k x_.

Build and install Zoneminder

    make
    sudo make install

Configure the database:

    mysql -uroot -p

Install Cambozola:

    cd
    wget [http://www.charliemouse.com:8080/code/cambozola/cambozola-latest.tar.gz](http://www.charliemouse.com:8080/code/cambozola/cambozola-latest.tar.gz) 
    tar xvfz cambozola-latest.tar.gz 
    sudo cp cambozola-*/dist/cambozola.jar /var/www/zm/

Make Zoneminder the root-page in Apache:

    sudo joe /etc/apache2/sites-enabled/000-default

Change “DocumentRoot /var/www” to “DocumentRoot /var/www/zm” and “Directory /var/www/” to “Directory /var/www/zm/”

Restart Apache:

    sudo /etc/init.d/apache2 restart

Change some system parameters:

    sudo sysctl kernel.shmall=134217728
    sudo sysctl kernel.shmmax=134217728

Make the system parameters permanent:

    sudo joe /etc/sysctl.conf

Add the following lines at the end:

    kernel.shmall=134217728
    kernel.shmmax=134217728

Install the startup-script (from the [official site](http://www.zoneminder.com/wiki/index.php/Debian_init.d)):

    sudo wget [http://viktorpetersson.com/upload/zm](http://viktorpetersson.com/upload/zm) -O /etc/init.d/zm
    sudo chmod +x /etc/init.d/zm
    sudo update-rc.d zm defaults
    sudo /etc/init.d/zm start

That’s it. You should now have a fully working version of ZoneMinder. All you need to do now is to point your browser to the IP address of the server.

**Update**: Thanks to Peter for pointing out that that there is a newer version of Cambozola. The guide has been updated to reflect this.
