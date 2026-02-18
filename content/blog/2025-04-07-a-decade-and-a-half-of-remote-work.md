---
slug: a-decade-and-a-half-of-remote-work
url: /remote-work/2025/04/07/a-decade-and-a-half-of-remote-work/
title: 'A Decade and a Half of Remote Work'
date: '2025-04-07T01:00:00+00:00'
categories: remote-work
tags:
- remote-work
- management
- leadership
- productivity
- teams
aliases:
  - /2025/04/07/a-decade-and-a-half-of-remote-work/
---

When I wrote [A Decade of Remote Work](/2019/05/18/a-decade-of-remote/) back in 2019, I had no idea a global pandemic would soon thrust remote work into the spotlight, turning it from niche to necessity overnight. Now, as I mark 15 years of building and running remote teams, I find myself revisiting and refining many of the lessons from the past and adding new insights gathered from recent experiences. This article is for tech startup founders and remote leaders, sharing practical advice for navigating the challenges and opportunities of long-term remote work.

In the following sections, I'll explore how remote work has evolved, discuss the essential principles that remain constant, and share practical strategies for building and maintaining effective remote teams. From hiring practices to documentation systems, from team cohesion to personal boundaries, these insights are drawn from real-world experience managing distributed teams across multiple time zones and cultures.

## Remote Work Still Isn't for Everyone

A core belief from my original article still stands true: remote work isn't suited to everyone. It demands discipline, strong self-management skills, and the ability to thrive without constant supervision.

Over the past five years, I've encountered hires who mistakenly thought remote work meant they could take care of their toddler _while_ working, to save on childcare costs. Remote work isn't different from office-based work regarding expectations. Yes, I encourage flexible schedules (feel free to handle errands midday to beat the crowds), but when you're at your desk, you're expected to perform effectively and reliably (without distractions!). Discipline and clear boundaries are non-negotiable. It's not an excuse to do other things or hang out on the sofa watching Netflix all day.

During COVID lockdowns, many young professionals who moved to large cities were suddenly confined in small apartments or stuck with roommates they barely tolerated. These circumstances highlighted that the environment matters significantly in remote productivity and mental health. It's a stark reminder that successful remote work needs an appropriate (and dedicated) workspace, something often overlooked.

When hiring remote workers, ensure they have the resources to invest in a proper workspace. We give our staff a budget to set up their home office. If bringing people into an office, you wouldn't have them work on the floor: you'd give them an appropriate desk and setup. Remote is no different. But even the best equipment in the world can't solve for the lack of self-discipline.

## Career Development and Growth

The transition from basic remote work principles to career development is natural, as the environment in which people work significantly impacts their professional growth. Some people argue that remote work is great for senior staff, but hinders junior team members' abilities to grow in their careers. One could certainly argue that a lot of knowledge transfer happens by osmosis (or by the watercooler) in an in-office setup. Many things are not written down and information just lives in someone's head. When you want to know, you walk over to Bob's desk and ask him how `$RANDOM_PROCESS` works. If you have built a good relationship with Bob, he will probably tell you all about it. But if you haven't, he'll probably shoo you away saying that he's too busy.

Now, if we compare that to a remote organization where there is well-maintained documentation and carefully crafted SOPs (see below), you are not at the mercy of your relationship to Bob to learn about `$RANDOM_PROCESS`. You just pull up the document and glance over it. Thus I would argue that when it comes to knowledge transfer, in many ways remote is actually _better_ than in-office. Assuming it's done right.

Now knowledge transfer and career development/growth are perhaps not exactly the same, but they are very much related. If you can read the SOPs and understand how and why decisions were made (see ADRs below), that can help you both understand the thinking and current processes of people further up in the ranks.

When it comes to actual career development and growth, we're living in an interesting time. At no point previously in history has information been as accessible as it is today. For anything you'd like to learn about (professionally or personally), you have a wealth of fantastic content on YouTube, or you can use ChatGPT (or the likes of) as your own personal tutor. No question is too small or dumb. Thus traditional career development and growth is kind of moot. It's not about sending people off to pay for silly courses and get a piece of paper that you did it. It's about actually _learning_ something.

When we do performance reviews, we of course cover career development. If a team member wants to learn something, we make a note of it and then devise a plan (largely based on publicly available content) on how to achieve that. You want to learn more about project management and planning to become a squad leader? Great, there are thousands (or probably hundreds of thousands) of hours of content readily available on YouTube for this. There is no longer _one_ way to learn and develop.

Moreover, with well-crafted SOPs and ADRs (see below), you can integrate them with an LLM such that anyone in the company can ask questions and learn both how and why things are done the way they are.

## Increased regulation

As remote work has become more mainstream, the regulatory landscape has evolved significantly. Since the initial article, a lot of things have changed on the legal side of running a remote-first company that spans numerous countries. With the rise of legislation like IR35 in the UK and AB5 in California, it's increasingly hard to hire staff as contractors in many regions. In response to this, we've seen a large wave of Employer of Record (EoR) companies, like Remote.com and Deel to address this. Given that we have headcount in both UK and California, as a remote-only company hiring in any of these regions, you're either forced to open a subsidiary in this country, or go through an EoR company. Both of which add a substantial premium.

## Remote-First vs. Hybrid: Choose Wisely

Post-pandemic, many organizations rushed back to hybrid or fully office-based setups. I'm still firmly convinced that a fully remote model is superior to hybrid. Hybrid models create unnecessary complexity, with neither remote nor in-office employees fully satisfied.

A remote-first approach demands intentionality, especially around documentation and asynchronous communication. It compels teams to write decisions and processes down clearly, which avoids confusion and ambiguity. After years of experimenting, I've found that intentional, remote-first workflows foster greater clarity and fairness across the entire organization.

## Documentation: Make It a Living Resource

Documentation is the backbone of successful remote teams. It ensures transparency and preserves institutional knowledge. However, writing things down isn't enough. Documentation must be actively maintained and integrated into daily workflows. Otherwise, it quickly becomes outdated and irrelevant.

We've integrated note-taking bots into nearly every meeting. These automatic notes are then reviewed, summarized, and stored within our documentation system, or referenced when disputes arise. Our primary tools include Google Docs, which has improved dramatically with pageless documents, and Phabricator (now Phorge) for wikis. The tools matter less than ensuring documentation is a living, constantly evolving resource.

## Standard Operating Procedures (SOPs): Clarity and Consistency

As the team grows, SOPs become critical. They detail exactly how key tasks, from onboarding new hires to software releases, are performed. However, SOPs only add value when people actually use and update them regularly. Assigning clear ownership for updates and regular reviews ensures they don't become outdated or ignored.

SOPs also address a different challenge: the bus factor. By having well-defined SOPs for how your organization does things, you are less at the mercy of a single stakeholder deciding to go AWOL, quit, or just go on vacation. Currently, we're making significant investments at Screenly to develop a Company Manual that holds SOPs for as many processes as possible.

## Architecture Decision Records: Capturing "Why"

We've adopted [Architecture Decision Records](https://adr.github.io/) (ADRs), stored in a dedicated GitHub repository. ADRs document significant technical decisions and the context, along with the reasoning behind them. This approach provides a clear record, enabling new team members to understand past choices without rehashing old debates. ADRs are concise and easy to maintain, serving as a crucial knowledge base for long-term technical clarity.

## In-Person Summits: Essential for Team Cohesion

Despite being remote-first, regular in-person meetups remain invaluable. Annual summits lasting five to seven days have proven ideal for us, providing enough time for meaningful work and team-building without being overly rushed.

Why 5-7 days? Well, the first and the last day are write-offs. On the first day, people will be landing at different times, and you're just settling into the accommodation. Other people might even be jetlagged. On the last day, people will be departing at different times, and if you have enough people, there will be a steady stream of people dropping off throughout the day. Thus if you do three days, you only really have one day of working/hanging out together (and some might even be jetlagged).

As far as locations, we've done a number of countries by now. One of the biggest deciding factors (beyond good weather) has always been visa accessibility, but your mileage may vary depending on where you have team members.

Also please note that these summits aren't just meetings; they're a chance to deepen connections that strengthen remote collaboration throughout the year.

## Health and Well-Being: Promoting a Balanced Lifestyle

Promoting physical health is crucial for remote workers. We've set up a Strava group integrated with Slack, creating friendly competitions and encouraging team members to stay active. It's a simple, engaging way to support fitness and healthy habits. Exercise isn't just a productivity booster, it's a mental health necessity, especially when working remotely.

## Remote Hiring in the Age of AI

The challenges of remote hiring have evolved significantly with the rise of AI tools. Hiring remotely has become significantly more challenging today. Back when I wrote the initial article, you could relatively quickly place candidates in either a reject or interview bucket. However, today the candidates that previously could barely string a sentence together or answer even basic screening questions will use ChatGPT (or the likes of) to ace these questions.

This makes it incredibly difficult (and time-consuming) to weed out qualified vs. unqualified candidates. Now, we're hardly the first ones to call this out, but when you're a remote-only company your pool of 'spray and pray' candidates is an order of magnitude higher than an in-office interview due to the sheer volume of possible candidates.

We've since tweaked our hiring methods a fair bit, but I'd lie if I said it is a solved problem today.

## Saving Time and Setting Boundaries

Remote work's biggest ongoing advantage remains the elimination of commuting, freeing significant time each day so that you can spend more time with your family (or for your hobbies or whatever). However, the saved time can disappear without proper boundaries. Maintaining consistent routines and setting firm limits on working hours protects against burnout. Personal routines and rituals help signal the start and end of the workday, maintaining productivity and balance.

## Looking Ahead

After fifteen years, remote work continues to evolve, but foundational principles remain constant: hire disciplined, trustworthy individuals, document extensively, foster healthy routines, and intentionally build culture. Embracing asynchronous work, investing in mentorship and onboarding, and clearly communicating remain crucial to sustained remote success.

In conclusion, remote work isn't easy, but it offers unmatched flexibility and freedom when done correctly. It requires continuous refinement, thoughtful adaptation, and clear, intentional practices. As remote work matures further, I'm excited to see how teams worldwide continue to adapt and thrive.

And for the love of god, don't force your team to use Microsoft Teams.
