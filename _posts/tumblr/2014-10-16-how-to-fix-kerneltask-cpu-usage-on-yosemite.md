---
layout: post
title: How to fix kernel_task CPU usage on Yosemite
date: '2014-10-16T11:01:00+03:00'
tags:
- mac os x
- yosemite
- os x
redirect_from:
- /post/100148585299/how-to-fix-kerneltask-cpu-usage-on-yosemite
- /2017/12/21/2014-10-16-how-to-fix-kerneltask-cpu-usage-on-yosemite.html
---
Yesterday I had to hand in my almost new MacBook Pro (Retina) for repair due to a broken logic board. This meant that I had to go back to my old laptop for a little bit.

In preparation for this, I dusted off my old MacBook Pro this weekend so that I would have something from in the meantime. Since it was due for an upgrade, I decided to [install the Yosemite beta](/2014/10/05/how-to-install-yosemite-and-ubuntu-linux.html) on it just to give it a try. After getting everything up and running, I did however notice that the laptop was rather unresponsive and sluggish.

After further analysis, I noticed that it was something odd with the `kernel_task` process hogging up resources, pegging the CPU at maximum utilization.

![kernel_task hogging resources](/tumblr_files/tumblr_inline_ndj4vrolbe1skxjxc.webp)

Spending a few minutes on thy mighty Google, I found multiple other people who were having similar issues across Mac models and OS X versions.

It appears that in case there is something wrong with the Mac, there is a chance that `kernel_task` will completely trash your system. For me, it was likely caused by a broken sound card.

Since I was getting pretty desperate, I decided to try [Rhys Oxenham’s](http://www.rdoxenham.com/?p=259) suggestion, and simply disable the kernel extension for the particular model.

As crazy as this may sound, it did indeed do the trick. My laptop is now **a lot** more responsive, and `kernel_task` is no longer consuming my entire CPU.

Rhys’ page includes a lot more details, but in summary, here’s what I did:

    # Find the model
    $ system_profiler -detailLevel mini | grep "Model Identifier:"
    Model Identifier: MacBookPro8,2

    # Move and backup the file
    $ mkdir -p ~/backup
    $ cd /System/Library/Extensions/IOPlatformPluginFamily.kext/Contents/PlugIns/ACPI_SMC_PlatformPlugin.kext/Contents/Resources
    $ sudo mv MacBookPro8_2.plist ~/backup/

After moving the file above and rebooting the system, things looked a lot more sane. ![More sane kernel_task](/tumblr_files/tumblr_inline_ndj4y6oLJl1skxjxc.webp)

Please note that **this is risky business** and there might be side-effects. It did do the trick for me, but **I don’t take any responsibility for damaged hardware**. It’s all on you.

**Update:** After about a week, I can confirm that this had no negative impact at all as far as I can tell. Battery life and performance was improved.

**Update 2:** Since El Capitan was released, a lot of people have been having issues applying this fix. Since it is a bit different, I’ve published a new post that covers how to do this on El Capitan: [How to fix kernel_task CPU usage on El Capitan](/2016/01/03/how-to-fix-kerneltask-cpu-usage-on-el-capitan.html).
