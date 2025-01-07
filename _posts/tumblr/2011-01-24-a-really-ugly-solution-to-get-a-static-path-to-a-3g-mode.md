---
layout: post
title: A really ugly solution to get a static path to a 3G modem
date: '2011-01-24T21:34:56+02:00'
tags:
- Linux
- Ubuntu
redirect_from: /post/92729943404/a-really-ugly-solution-to-get-a-static-path-to-a-3g-mode
---
This solution is so ugly that I felt that I had to post it =).

I had a problem. Whenever I plugged in or rebooted, the a 3G modem into a Linux machine, it appeared on a different path (/dev/ttyUSBX). That creates some issues, as I’m using to connect to the internet, and Wvdial is using a hardcoded path to the modem. To fix this, I had to manually edit the file every time it changed. That’s very annoying. Now add in the fact that this is sitting on a remote machine that I have little physical access to, this is a real problem.

My initial approach was to turn to udev and write a rule for the modem that creates an automatic symlink, such as /dev/modem. Unfortunately, when you add usb\_modeswitch into the mix, it breaks. For some reason, usb\_modeswitch simply wouldn’t detect the modem when doing this, and hence render it useless.

Instead, I figured, if I write a Bash-script that automatically creates a symlink, that would take care of the issue. Of course, it is very ugly, but it does indeed work. Now I can simply run this script in Cron and that way know that I always have the correct path to the modem.

So how did this script look you may ask. This is how:

 #!/bin/bash
 MODEM=$(cat /var/log/messages |grep "GSM modem (1-port) converter now attached to" | tail -n 3 | head -n 1 | perl -pe "s/.\*GSM modem \\(1-port\\) converter now attached to (ttyUSB.\*)$/\\1/g;")
 CURRENT=$(ls -l /dev/modem | awk '{print $10}' | perl -pe "s/\\/dev\\/(ttyUSB.*)$/\\1/g;")

 if \[ $CURRENT != $MODEM \];
 then
  rm /dev/modem
  ln -s /dev/$MODEM /dev/modem
 fi

I never said it was pretty, but it does indeed work. If you wonder what the ‘head’ and ‘tail’ part is all about, it is because the system creates three paths, but only the first one works.

**Update**: Turns out it is a bad idea to run this in Cron, as the logs will rotate. Instead, launch it at boot in rc.local, but make sure you insert a ‘sleep 10′ or similar to allow the modem to settle.

**Update 2**: Turns out there is a far more elegant solution to the problem. The system automatically generates a symlink for you. In my case, the modem is accessible via:  
`_/dev/serial/by-id/usb-HUA\_WEI\_Huawei_Mobile-if00-port0_`  
This means that you can hard-code that path instead of having to run a silly script to generate a symlink for you.
