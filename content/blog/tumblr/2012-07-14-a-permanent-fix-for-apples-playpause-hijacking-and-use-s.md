---
slug: a-permanent-fix-for-apples-playpause-hijacking-and-use-s
title: A permanent fix for Apple's "play/pause"-hijacking (and use Spotify)
date: '2012-07-14T22:57:02+03:00'
tags:
- Apple
- Mac OS X
- Spotify
aliases: /post/92729965694/a-permanent-fix-for-apples-playpause-hijacking-and-use-s
---

I hate iTunes with passion. It’s bloated and annoying. However, since it is a major revenue stream for Apple, they try hard to push it into your face as often as possible.

Since I started using Spotify a few years back, I don’t think I’ve used iTunes to play music once (only to upgrade iOS-devices before the over-the-air-updates came out).

As long as you don’t touch any other Apple products, Spotify will take over the media control-keys, but as soon as you start one of Apple products (like Keynote or Quicktime), Apple hijacks the media control-keys. It’s beyond frustrating. Instead of starting (or pausing) the music in Spotify, iTunes pops up and it makes me furious every time.

Fortunately, I just found a solution. It isn’t perfect, but it’s better than anything else I’ve found.

- Start by going to “System Preferences” -> “Keyboard” and select “Use all F1, F2, etc. keys as standard function keys”
- Next, download the application [Shortcuts](http://itunes.apple.com/us/app/shortcuts/id402271673?mt=12) from Mac App Store

Within Shortcuts, you now need to create two Apple Scripts: one for play/pause, and one for next track.

The Play/Pause script looks like this:

tell application "Spotify" to playpause

And the ‘Next Track’ looks like this:

tell application "Spotify" to next track

Now simply just bind these scripts to your Play/Pause button (F8) and Next button (F9).

![](https://vpetersson.com/wp-content/uploads/2012/07/Shortcuts-600x413.png "Shortcuts")

**Note**: I’m not using the regular F8/F9 mapping, as I’m not using an Apple keyboard.

There are three drawbacks with this approach unfortunately. First, it is hardcoded to Spotify. That’s fine with me, as that’s the only media player I really use the media control keys for. The second drawback is that you need to access all the non-function keys using FN+\[the key\]. The third drawback is that you need to have the Shortcuts-application running at all times.

For me these are reasonable compromises, but a compromises nonetheless. In a perfect world, Apple would just stay away from hijacking the keys.
