---
slug: the-last-20-percent
title: "The Last 20%"
date: '2026-08-21T09:00:00Z'
image: /assets/claude-replace-xero.png
tags:
- ai
- entrepreneurship
- startups
- migration
---

![A Claude prompt box reading "Hey Claude, build me a new accounting software to replace Xero. Don't make any mistakes."](/assets/claude-replace-xero.png)

The other day my friend Chris pinged me on a [Twitter thread](https://x.com/vpetersson/status/2089637913709465773). [Todd Dailey](https://x.com/twid/status/2085407667556614259) was making the case that digital signage is a huge industry selling bad products with high subscription fees, and that with a $40 e-ink ESP32 board you could just go build your own conference room signage with AI. Fair point. I'd add that the security posture across the industry is pretty terrible too.

But it got me thinking. Everyone is talking about how AI is going to kill every industry. Anyone with a Claude subscription is apparently going to replace every SaaS tool they pay for with something they vibe coded themselves. It's a compelling story. We all like to think we can build something better than the incumbent. Now we have the tool.

Don't get me wrong. I have been [vocal about enshittification](https://www.linkedin.com/pulse/enshittification-viktor-petersson-zovhe) and how shitty much of the software world is. The more niche the vertical, the shittier the product. Historically you could get away with it, because of the moat of insights (and to some degree, resources).

So gather round, kids. Let me tell you about this exact thing.

One of my first ventures into the world of startups was a now decommissioned product called YippieMove. That was almost 20 years ago. The product was straightforward: it copied the contents of one email account to another. The use case was either that you were switching services (a company moving from platform X to Y), or you wanted a backup of your email.

On the face of it, it seems like an easy thing to build. You are literally copying from one server to another using a standardized protocol. There is even an [RFC](https://www.rfc-editor.org/rfc/rfc9051.html) for it. Should be simple. It wasn't. And this is where armchair entrepreneurs massively underestimate the complexity of building a product for the real world.

Yes, with today's tools you could probably build 80% of YippieMove in a week. That's true for most products out there. You can clone 80% of them in days by vibe coding with Claude (assuming you know what you are doing).

But it's the last 20% that's hard. That's where the edge cases live. That's where the hard-won lessons are. In the case of YippieMove, Claude would have implemented the RFC and claimed it had the _perfect_ solution. On paper, it would be right. In practice, it's naive.

Any seasoned engineer will tell you the same thing. Standards are great, but in the real world they are only "kind of" followed. If everyone implemented them perfectly, life would be easy. They don't. For $REASONS, companies like to put their own flavor on things. They interpret standards to suit their environment. Usually to fit their own systems.

Email is a great example. Yes, there is a standard behind IMAP, but once you start moving email around at scale you run into a billion edge cases. Gmail is a good one. Labels don't exist in IMAP. They get mapped to folders, which do exist. By default every message lives in All Mail, and there is another copy for every label that message carries, including the inbox. So you need to copy each email N times, because you can't make assumptions about the destination. If the destination is also Gmail, the copies get deduplicated. If it isn't, the user ends up with N copies.

That's a tame example. Here's a hairier one. Flags. They're an internal building block in IMAP, used for things like read/unread status. Sounds well defined enough. Wrong. Some servers support all flags. Others support only some. And it isn't just inconsistent across servers, it's inconsistent across versions of the same server. Microsoft Exchange was a great example of this. There are plenty of open source IMAP servers where an agent could plausibly check the behavior and build support around it, but many are proprietary. The only way to learn is trial and error. We moved tens of thousands of accounts over the years, and the edge cases kept coming. Every time we thought we had it figured out, something new showed up.

That's the point. The first 80% is easy. It was already largely a solved problem with Django, Rails, React, Tailwind and the rest. The remaining 20% is what separates your vibe coded "SaaS killer" from a battle-tested product. Lovable and its peers are a layman's version of those same frameworks. They give you the boilerplate. Not the hard part.

Most armchair entrepreneurs have never built anything for the real world. That's why they have no idea about the agony and the time it takes to solve the remaining 20%. It takes real data. Real users. Real time. It's painful, slow and annoying. But it's the difference between a battle-tested product (commercial **or** open source) and your yolo'd vibe coding project. Claude can help you implement the lessons from those edge cases fast and well. It just can't give you the insights.
