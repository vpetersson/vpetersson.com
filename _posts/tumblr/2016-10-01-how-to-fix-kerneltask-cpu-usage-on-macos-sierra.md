---
layout: post
title: How to fix kernel_task CPU usage on macOS Sierra
date: '2016-10-01T17:02:52+03:00'
tags:
- mac os x
- sierra
- kernel_task
- usb-boot
redirect_from: /post/151192357764/how-to-fix-kerneltask-cpu-usage-on-macos-sierra
---
In my post [How to fix kernel_task CPU usage on Yosemite](/2014/10/16/how-to-fix-kerneltask-cpu-usage-on-yosemite.html), I first wrote about how a broken logic board can trigger high CPU usage from `kernel_task` as well as how to fix it. When El Capitan later were release, the issue [remained](/2016/01/03/how-to-fix-kerneltask-cpu-usage-on-el-capitan.html).

Now, with macOS Sierra out, I upgraded my old MacBook Pro (8,2) as well. As expected, the issue remained the same.

Luckily, the same fix that I wrote about [El Capitan](/2016/01/03/how-to-fix-kerneltask-cpu-usage-on-el-capitan.html) still worked.

The only issue I had was that my system didn’t boot properly into recovery mode. Instead, I had to utilize a USB stick with the macOS Sierra installer on to be able to turn off System Integration Protection (SIP).

If you run into the same problem, you can find the instructions for creating a bootable USB stick in my article [Create a bootable USB drive for Yosemite the easy way](/2014/09/19/create-a-bootable-usb-drive-for-yosemite-the-easy.html). You will of course have to replace “Install OS X Yosemite Developer Preview.app” with “Install mac OS Sierra.app”.