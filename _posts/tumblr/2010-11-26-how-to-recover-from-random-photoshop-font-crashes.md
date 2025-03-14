---
layout: post
title: How to recover from random Photoshop (font) crashes
date: '2010-11-26T02:29:02+02:00'
tags:
- Adobe
- CS5
- Illustrator
- Photoshop
redirect_from: /post/92729932389/how-to-recover-from-random-photoshop-font-crashes
---

Photoshop and Illustrator are somewhat of required apps today. You realize how much you need these apps when they decide to not play ball. This have happened to me a few times, and it often relate to fonts. Photoshop simply crashes when I bring up the font tool. Given that this is probably one of the most frequently used tools, this is a pretty big deal.

The bug-report isn’t that helpful either. You’ll only get something like:

> Exception Type: EXC\_BAD\_ACCESS (SIGSEGV)\
> Exception Codes: KERN\_INVALID\_ADDRESS at 0×0000000000000108\
> Crashed Thread: 0 Dispatch queue: com.apple.main-thread

Yeah, that’s hardly enough to even figure out that it the underlaying reason may be a corrupt font. A quick Google query showed that I was hardly the only person having this issue. There are numerous posts on Adobe’s forum on this, but few useful answers.

One of the most common suggestions is to [remove duplicate fonts in Font Book](http://docs.info.apple.com/article.html?path=FontBook/2.2/en/5285.html). While I found a few duplicates, that didn’t do the trick.

After much searching, I found a page called [Troubleshooting fonts](http://kb2.adobe.com/cps/843/cpsid_84363.html) at Adobe’s website. Solution 3 on that page includes a very handy script named [Font Test Script](http://kb2.adobe.com/cps/843/cpsid_84363/attachments/FontTest.jsx). What the font does is to go trough all the fonts on your system within Photoshop and log the result. If it runs across a corrupt font and Photoshop crashes, it logs the result. Next time you fire up the script, it will display the broken font. (See the [README](http://kb2.adobe.com/cps/843/cpsid_84363/attachments/FontTest_readme%5B1%5D.pdf) for more details.)

Now you can simply disable that font from Font Book and you should be good to go.

This script really saved me from a lot of frustration and the script should really be bundled with Photoshop. Also, Adobe should really improve the crash management.

On a side-note, I really hate the fact that Illustrator and Photoshop are **required** apps today. While they are great apps, I hate to admit that there are really no viable alternatives (don’t say Gimp and Inkscape, because they are far from at par). This, and because of their proprietary formats, is why Adobe can maintain their insane price-tag. I really hope that [Pixelmator](http://www.pixelmator.com/) will grow to become a viable alternative in the years to come.
