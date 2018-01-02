---
layout: post
title: Receive calls with Google Voice (over VoIP) for free
date: '2015-04-07T11:46:55+03:00'
tags:
- Google Voice
- VoIP
- Google
- digital nomad
permalink: /post/115749865249/receive-calls-with-google-voice-over-voip-for
---
I’ve been using Google Voice for a long time. In fact, I started using it back when it was called Grand Central (which was an acquisition). It’s a great product, and I really love it. Unfortunately it has more or less been left untouched for the last few years.

If you’re in the U.S., Google Voice works great. You can just forward your Google Voice to your cell phone and you will automatically receive calls there.

Much of the time however, I’m not in the U.S.. As digital nomad, I usually on the road and constantly swap SIM cards (which accidentally is why I created [NomadSIMs.io](http://nomadsims.io)). Because I constantly switch SIM card, it becomes even more important to have a persistent number that can be re-routed to a number that I can be reached at.

My first approach to this problem was to simply purchase a Skype-In number and have my Google Voice number forwarded to this number when I’m outside of the U.S.. Unfortunately this doesn’t work very well, as Skype will try to take over the voicemail (along with a number of other issues).

Today I had to revisit this problem as I had to receive a to my Google Voice number to verify a purchase. My initial idea was was to do something with Twilio. However, since you currently cannot connect a SIP softphone to Twilio, that turned out to be a no-go.

After some more research, I was ran across [CallCentric](http://www.callcentric.com). While the site looks like a relic from the 90s, they do offer something relevant: **a free US number with free inbound calls** ([direct link](http://www.callcentric.com/coverage/free_phone_number)). This is exactly what I needed.

When you’ve signed up, you’ll get a New York number that you can add to your Google Voice.

Next, you need to get a softphone/VoIP client for your desktop. I first tried out [Telephone](https://itunes.apple.com/us/app/telephone/id406825478?mt=12), but that didn’t work well. I then tried [X-Lite](http://www.counterpath.com/x-lite-download/), which isn’t very pretty, but it works.

With all that set up, you can now receive inbound calls on your Google Voice number wherever you are in the world.

For outbound calls I still use Skype (with their Unlimited plan).
