---
layout: post
title: So you want to build a remote company?
date: '2019-07-14T14:00:00+01:00'
categories: remote-work
tags:
- startups
- remote-work
- productivity
- digital-nomad
---

Little did I know when I wrote [A Decade of Remote Work]({{site.url}}/remote-work/2019/05/18/a-decade-of-remote.html) that it would completely blow up. After being featured on Hacker News, the article to this day keeps driving a significant amount of traffic from all kind of sources (including Twitter).

Since the article, I’ve started a [series of articles]({{site.url}}/remote-work/) on remote work. In this article, I will explore the topic of creating a remote company. I briefly touched on this topic in the initial article, but in this article, I will explore this in greater detail and include things like how to setup a company, to how to hire and what tools I personally I find necessary to get off the ground (including the reasons for these tools).

Please note that the advice below is largely focused around software companies, and it will likely not be very useful for non-digital companies.

## Incorporation

Many first-time entrepreneurs find the process of creating a company a daunting task. It’s understandable. Depending on your jurisdiction, the complexity of starting a company varies. This of course is added on top of the mountain of things that a first-time entrepreneur needs to be get familiarized with (such as product development, potential fund raising, hiring etc).

While [IANAL](https://en.m.wikipedia.org/wiki/IANAL), my non-legal advice would be to try to keep things simple. If you expect your customers to be based in the US, it makes sense for your company to be incorporated in the US. If your customers are expected to be based in the EU, then incorporating in EU makes sense. Note that I haven’t mentioned at all where _you_ are based.

Having run companies in multiple countries by now, I can say that operating headache of a company in the US is a lot lower than it is in the EU (Sweden was a major PITA). I have no personal experience of running companies in Asia, but presumably Hong Kong and Singapore are good places.

Depending on where you decide to incorporate, I would recommend [Stripe Atlas](https://www.stripe.com/atlas) for US companies, and [Startup Estonia](https://www.startupestonia.ee/) for EU companies. It should however be said that I have yet not used any of these two services myself, but I hear good things about them.

Also do note that if for instance you are looking to tap into a government scheme for fundraising/financing, such as SEIS in the UK, you likely need to be incorporated in the given country.

The bottom line is that try to keep things simple for both yourself and your customers. Contrary to the common advice you will receive from your local advisors, this does not mean that you’re stuck to incorporating in the country you’re from/live in. If anything, this likely makes you _less_ attractive to future investors/buyers than if you’re incorporated as say a Delaware C-Corp (which is the golden standard for tech startups).

## Tools for collaboration

Ok, so you have now incorporated and are ready to start building your company. The first thing you need is to get the tools ready such that your team can start build the product effectively.

While I will try to avoid recommend any particular tool, and rather give categories of tools that I find required for day-to-day activity of a software company. These categories of generally look something like this:

- External communication (i.e. email, these platforms usually come with calendar as well)
- Internal communication (such as Slack for text based, and some other video conferencing app)
- Code hosting (such as Github or Gitlab)
- Project management (Github now does a good-enough job for this these days IMHO)
- Design review tool (this is often overlooked, but tools like [InVision](https://www.invisionapp.com/) makes a massive difference when reviewing product and website design)

Finally, don’t get tempted to run things yourself. **Go for hosted solutions**. While it might seem tempting to run service X yourself, because “_a VM on Digital Ocean only cost $Y per month, while the hosted version cost $Z per month_” (where Z>Y). Unless you’re operating at **very large** scale, this rarely ever makes sense. Thing break, and you **will** end up spending a lot of time maintaining said server(s), have downtime, and/or forget to take proper backups, which will lead to data and productivity loss.

## Hiring

I briefly touched on hiring in my initial blog post. It’s a topic worth exploring further, as it is far from trivial and _will_ consume a huge part of your time as an entrepreneur.

Let’s start with sourcing. While sites like Upwork has received a bad rap because of the poor quality of the majority of the candidates, it is still one of the best places to recruiting talent. Yes, you will receive a large number of unqualified applicants, but there are ways to work around this. The reason why I personally like Upwork is because of the massive talent pool. In recent years, there has been a big increase of job boards that focuses on remote workers. However, they tend to just be more expensive and more polished versions of Upwork (don’t get me started on Upwork’s horrible and insanely buggy user interface) with smaller talent pools. So, used right, Upwork can be used to find qualified team members.

Here are my tips for when hiring on Upwork:

- Ask questions where applicants are required to write a proper answer. The key here is to rule out applicants that simply applies to a large number of roles without effort.
- Cover letters are overrated. A set of well-crafted questions will give you a lot more insight into the candidate than a cover letter where the candidate raves about how amazing your company is (and where 90% of the content is re-used).
- Sneak in a test in the job description to test for attention to details. This can take a lot of forms, but for instance, you could say that they need to include a certain word in their application, or apply using a special process.
- Look at their Github profile and/or portfolio. Their prior work usually tell you a good amount about a person. Do however note that there are great applicants that have little to show for their work because they ware not allowed to share it due to their previous employer.
- You get what you pay for. Yes, pricing arbitrage is still a real thing, but you’d be foolish if you assume that a talented developer in say Russia will not sooner or later realize his/her market rate. You can still find great talent at a large discount compared to your local market, but don’t expect a developer that cost $8/h in India to be comparable to a developer that cost $30/h in Russia. Global markets like Upworks help establish fairly sensible equilibriums between quality and price (in particular with the review process).
- Never hire contractors affiliated with agencies. I outlined why in the initial blog post, but in short, you want a direct relationship without a proxy being involved.

The above tips, combined with ruthless screening should help you find those diamonds in a rough that are still out there on Upwork.

## Managing the team

You’ve now incorporated, set up the required tools for collaboration, and have hired your first N team members. Good job!

After granted everyone access to the various tools. Let the fun begin.

One of the most important thing to do is to make your team members feel like they are a team, and not just a cogs in a wheel. From my experience, many Upwork contractors are used to being treated like crap and to just blindly take orders (usually from people without domain expertise). This is where you have to differentiate yourself to get the best out of your team. Make them feel part of the process. Listen to their input matter. It usually takes a while for them to feel comfortable to open up and have an honest discussion with you, as they’re used to just receiving orders, but it’s essential for a well-oiled team.

While there are many things that are different when running a remote team, most of the core management principals still apply. For instance, feedback is still important (praise in public, criticize in private etc).

One thing that is different when managing a remote team has to do with the asynchronous nature of the work. Because the team members are likely on different timezones, it is essential to have good processes for managing work. In the collaborative section, I mentioned a product management tool being essential. This should of course not come as a surprise, but it is important that each team member has a backlog that can be worked on (either individual or as part of their team). There are numerous process for managing this, where Agile/Scrum is likely the most popular way of doing this right now. How you do planning/review/retrospectives is beyond the scope of this article, but the what is essential is that every team member can simply wake up in the morning and know what they are expected to work. It is also important that the workload is predictable and priorities are not changing every day (or worse, multiple times per day).

Lastly, you need to trust your team members. I wrote about this in [How we work at Screenly](https://www.screenly.io/blog/2016/11/23/how-we-work-at-screenly/). In short, if you don't trust your team members, and you feel the need to constantly monitor and micro manage them, you're fighting a losing battle. Nobody wants to work for someone who doesn't trust them.

The above is by no means everything you need to know to manage a remote team, but it should hopefully get you started.

If you got any questions, or additional tips, feel free to tweet me at [@vpetersson](https://www.twitter.com/vpetersson).
