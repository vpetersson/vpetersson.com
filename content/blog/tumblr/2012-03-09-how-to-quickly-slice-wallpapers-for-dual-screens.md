---
slug: how-to-quickly-slice-wallpapers-for-dual-screens
title: How to quickly slice wallpapers for a dual-screen setup
date: '2012-03-09T11:18:18+02:00'
tags:
- ImageMagick
- Mac OS X
aliases: /post/92729961269/how-to-quickly-slice-wallpapers-for-dual-screens
---

In this day and age, many people use multi screens in their setup. I’m one of those people. One thing that really bugs me in OS X however, is that you cannot set one wallpaper to expand beyond one screen.

Let’s say you have two screens with 1920×1080 resolution and you have found a wallpaper of the appropriate dimension (ie. 3840×1080). [Interfacelift](http://interfacelift.com/wallpaper/downloads/date/2_screens/1920x1080/) got plenty of them.

Now, in order to properly use these, you need to slice the image into two images (one for each screen). Sure, you can do this in Photoshop, but that feels like an overkill.

Instead, let’s use the good ‘ol tool [ImageMagick](http://www.imagemagick.org/) (you can install it using [Homebrew](http://mxcl.github.com/homebrew/)).

convert source.jpg -crop 1920x1080 sliced.jpg

And voilá — you know got two images. One for each screen:

- sliced-0.jpg
- sliced-1.jpg

That wasn’t very hard, was it? If you have screens of different resolutions, that is a bit trickier, but ImageMagick should still be able to do it.
