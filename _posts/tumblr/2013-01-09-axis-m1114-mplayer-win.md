---
layout: post
title: Axis M1114 + mplayer = Win
date: '2013-01-09T20:53:00+02:00'
tags:
- axis
- ip-cam
redirect_from: /post/92729972699/axis-m1114-mplayer-win
---
I’m a long-time fan of Axis’ IP cameras. I’ve played with a few other IP cameras too, but I’ve never come across a camera with the performance and stability of Axis’ products.

Recently I deployed two [Axis M1114](http://www.axis.com/products/cam_m1114/)-cameras. It’s an impressive device with built in motion sensor (that can record to a SMB or FTP) with Power over Ethernet (PoE). The optics in the device is equally impressive, as it capable of recording data in down to 0.6 Lux.

Once I had deployed the cameras, I wanted to view the feeds on two statically mounted monitor. With the help of two spare monotors and an Asus EEEPC (a low-powered Atom-based computer with both HDMI and VGA output) I was able to do just that. A simple Ubuntu installation with auto-login did the trick. The secret sauce however was mplayer.

Since this is a low-powered computer with a rather powerful GPU (Nvidia ION), I had to offload the rendering to the GPU to avoid overheating. After installing the required GPU drivers and configure both monitors, all I had to do was to create two scripts and have them launch at boot:

**cam0.sh**

    
    #!/bin/bash
    sleep 5
    while [ true ]
    do
        mplayer -nosound -display :0 -quiet -vo vdpau -vc ffh264vdpau -fs rtsp://cam0/axis-media/media.amp?videocodec=h264 -rtsp-stream-over-tcp -hardframedrop
        sleep 2
    done
    

**cam1.sh**

    
    #!/bin/bash
    sleep 5
    while [ true ]
    do
        mplayer -nosound -display :0.1 -quiet -vo vdpau -vc ffh264vdpau -fs rtsp://cam1/axis-media/media.amp?videocodec=h264 -rtsp-stream-over-tcp -hardframedrop
        sleep 2
    done
    

Simple as pie! Even with two streams, the computer is at 99% idle. Also, even if the power goes out, the computer will automatically boot up and show the stream.

If you have different hardware, you might need to adjust the ‘-vo’ and ‘-vc’ variables to fit your hardware.
