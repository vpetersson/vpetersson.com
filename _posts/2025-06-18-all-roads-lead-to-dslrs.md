---
layout: post
title: "All Roads Lead to DSLRs"
tags: [podcast, video, equipment]

---

I've been running my video podcast [Nerding out with Viktor]({{ site.url }}/podcast/) for about a year and a half now, with just under 50 episodes published.

When I [started out]({{ site.url }}/2024/06/20/on-launching-a-video-podcast-in-2024.html), I tried to keep things simple and cheap. I used my Logitech Brio 4K webcam - a webcam that I picked up during COVID. Not long after, I upgraded the audio by adding a dedicated microphone, the Audio-Technica ATR2100x-USB. It did the job early on, but the sound still wasn't quite crisp. Eventually, I gave in and bought the Shure MV7 (USB), which is the go-to mic for many podcasters. That one stuck and I've had no audio issues since.

![Logitech Brio 4K webcam](/assets/logitech-brio.webp)

## Attempt 1: iPhone

Video was more of a headache. The Brio was okay for video calls, but the color balance was always a bit off, and Riverside [didn't support 4K recording using it](https://support.riverside.fm/hc/en-us/articles/9684909831325-Camera-Logitech-Brio-Logitech-4K-Pro). I figured I cracked it when Apple released Continuity Camera, which let me use my iPhone as a webcam. It looked great...until it didn't. Twice it dropped a bunch of frames during recordings, and once it randomly shut down (probably overheated). This was on top of the fact that my computer just refused to connect to it occasionally. After a few episodes with sub-bar quality, I gave up and started looking for alternatives.

![Continuity Camera in action](/assets/continuity-camera.webp)

By now, I'd also had a bunch of guests on the show. The difference between setups is clear as day. People using DSLRs just look better. Even the best webcams can't compete to even an entry-level DSLR when it comes to sharpness and depth of field. Here are some examples of people I've interviewed who have great DSLR setups:

- [The Systems Behind Managing High-Performing Remote Teams with Jon Seager]({{ site.url }}/podcast/S02E11.html)
- [Exploring the Depths of Linux and Open Source Innovation with Mark Shuttleworth]({{ site.url }}/podcast/S01E13.html)
- [Nerding out about Prometheus and Observability with Julius Volz]({{ site.url }}/podcast/S01E02.html)

## Attempt 2: GoPro

At this point, I thought I'd found a clever workaround: a GoPro Hero 13. On paper, it's a 4K camera packed with features, and I could use it for events too. So I bought one. That's when the trouble started.

![GoPro Hero 13](/assets/go-pro-hero-13.webp)

In theory, you can connect a GoPro via USB and use it as a webcam. **In theory.** The [reviews](https://apps.apple.com/gb/app/gopro-webcam/id6477835262?) on the App Store say otherwise. I didn't realize that until after I got it. Technically speaking, I think it completely broke as webcam when Apple started to put more restrictions on webcams and GoPro simply didn't want to play ball. Apparently you can get it to work by [turning on legacy camera mode](https://discussions.apple.com/thread/255256244?sortBy=rank), but I wasn't really interested in dropping the security of macOS just because GoPro wont fix their software/firmware.

But I was already committed, so I tried a workaround: buying the Media Mod (which gives you HDMI output) and hooking it up to an HDMI capture card.

Technically, it worked. But the video looked terrible. It was mirrored (easy fix), but the image was blurry, distorted, and had that GoPro fisheye vibe. Not exactly what you want for a podcast. I get it, the GoPro is made for people jumping out of planes, not people sitting in front of a bookshelf. Still, for something that cost close to £500 with all the add-ons, I expected better.

I returned it and went back to the drawing board.

## Attempt 3: Elgato Facecam Pro

Next up was the Elgato Facecam Pro. It looked promising and had solid reviews. I placed the order. And waited. Two weeks later, it still hadn't shipped out. So I cancelled it. Maybe it's great. I'll never know.

## Attempt 4: Sony ZV-E10

Eventually, I gave in and bought a dedicated camera. I went with the Sony ZV-E10—technically a mirrorless camera rather than a DSLR. And wow. What a difference.

![Sony ZV-E10](/assets/sony-zv-e10.webp)

There's no comparison. The video quality is on a completely different level. I picked it because ChatGPT recommended it (yes, really), and also because it was discounted at the time. It might be getting a bit old, but it's still a fantastic camera.

It's not cheap. You'll spend more than you would on any webcam or GoPro, but you're getting a proper camera—technically mirrorless, but in the same league as a DSLR—not just a webcam. You can grab the kit with the lens for £699 directly from Sony. I opted to buy the body only and paired it with the Sigma 16mm f/1.4 DC DN Contemporary lens. That pushed the price up a bit, but I think it was worth it.

What surprised me the most was how easy it was to get going. I figured I'd need an HDMI capture card, but plugging it in via USB just worked. macOS detected it right away - no drivers, no fuss.

**Update:** I can't belive it took me this long to figure it out but if you have a "Mark I" (i.e. first iteration) of the ZV-E10, it will only do 720p over USB. If you want 4k, you need to use a HDMI capturing card. It took me several months to realize this, as I was convinced it was a limitation in Riverside (which I use for podcast recordings). Only when I tested this hypothesis did I realize that the limitation was on my end.


## The takeaway

If you care about image quality, all roads really do lead to a DSLR – or at least a mirrorless camera. Webcams just can't compete, no matter the price. There are some decent ones out there, but they all come with compromises. Lenses are big (and heavy) for a reason. You can't fake physics in software. At least not yet.

Don't get me wrong - if all you just want something that looks OK on a video call, a webcam is sufficient. But if you want to have something that really comes across as crisp and professional in 4K, you'll end up with a DSLR or a mirrorless camera.
