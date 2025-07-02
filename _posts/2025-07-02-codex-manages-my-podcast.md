---
layout: post
title: Codex manages my podcast
date: '2025-07-02T01:00:00+01:00'
tags:
- podcast
- automation
---

When I started my podcast a year and a half ago, I looked at the tools available. For those not familiar, for many platforms (like Amazon Music and Apple Podcasts) you need to provide an RSS feed with your podcast. Now, there is no shortage of platforms that will gladly sell you this. But essentially, what you're paying for is a thin layer on top of S3 with FFmpeg and some duct tape.

Long story short, I didn't want to pay for that, so I wrote and open sourced [podcast-rss-generator](https://github.com/vpetersson/podcast-rss-generator). It's a small script that takes a YAML file and turns it into an RSS feed. This can then be copied to your block storage of choice (like S3 or R2).
It can even run as a GitHub Action.

Over the last year I've tweaked it and made it pretty complete against the RSS standard.

For the last few months, I've had Cursor populate this for me based on the transcript. That was fine, but I wanted to automate it further.

Enter [OpenAI Codex](https://openai.com/blog/openai-codex). With Codex I can take this a step further. By just adding a simple `agents.md` that tells Codex how to verify the file, I can now just tell it to add a new episode. Give it the title and description. Everything else it will infer from previous episodes. It then spits out a pull request that I can just press merge on.

So here's the takeaway: machine-readable and writable toolkits, like podcast-rss-generator, will become increasingly useful and important. These tools slot perfectly into the new wave of AI agents that will automate our lives.

Oh and PS, this blog post was written on my phone in Notes.app, and then deployed to my website using, yep you guessed it, Codex.
