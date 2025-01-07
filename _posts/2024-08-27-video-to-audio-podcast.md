---
layout: post
title: |
    Nerding Out with Viktor is now available as audio-only, a.k.a Turning my video podcast into an audio podcast
date: '2024-06-27T01:00:00+01:00'
tags:
- podcast
- startup
- entrepreneurship
---

In my previous article, [Launching a Video Podcast in 2024: My Journey and Lessons Learned]({{ site.url}}/2024/06/20/on-launching-a-video-podcast-in-2024.html), I shared my experience of starting a podcast. Since then, I came across some intriguing [research](https://www.thepodcasthost.com/planning/should-i-make-a-video-podcast/) revealing that 43% of podcast listeners prefer audio-only formats. This got me thinking—by offering my podcast solely as a video feed, I might have been missing out on a significant audience. Given that I had already developed my own [podcast RSS generator](https://github.com/vpetersson/podcast-rss-generator/), this presented a perfect chance to nerd out a bit.

Since my podcast RSS generation is already integrated into GitHub Actions, adding an audio-only feed was a straightforward process. Using the ever-reliable `ffmpeg`, I extracted the audio from the video files and repackaged it as an audio-only podcast RSS feed. Surprisingly, it really was that simple. After tweaking the URLs and adjusting the top-level title, I had a fully functional audio-only podcast feed ready for listeners. Best of all, there’s no extra work needed moving forward.

Once the RSS feed was uploaded, the final step was to add it to [Spotify](https://open.spotify.com/show/6pj5BL8V1kLJJzc76MsVqj?si=48213c4556ea4c7b) and [Apple Podcasts](https://podcasts.apple.com/gb/podcast/nerding-out-with-viktor-audio-only/id1765124230) as a new feed—and just like that, it was good to go!

## GitHub Actions workflow

Here's the complete GitHub actions workflow file I'm using for building and generating my podcasts for both video and audio.

```yaml
name: Publish nightly

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
  schedule:
    - cron: "00 01 * * *"
env:
  XQ_VERSION: 1.2.3
  YQ_VERSION: 4.44.3
  R2_BUCKET: my-r2-bucket
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          $ sudo apt-get -qq update
          $ sudo apt-get -qq install yamllint

      - name: Install xq
        run: |
          $ wget -q https://github.com/sibprogrammer/xq/releases/download/v${XQ_VERSION}/xq_${XQ_VERSION}_linux_amd64.tar.gz
          $ tar xfz xq_${XQ_VERSION}_linux_amd64.tar.gz

      // ... remaining YAML configuration ...
```

// ... rest of the document ...
