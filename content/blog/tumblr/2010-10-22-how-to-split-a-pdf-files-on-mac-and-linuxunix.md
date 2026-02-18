---
slug: how-to-split-a-pdf-files-on-mac-and-linuxunix
title: How to split a PDF files on Mac, Linux or Unix
date: '2010-10-22T16:52:05+03:00'
tags:
- Linux
- Mac OS X
- PDF
- Unix
aliases: /post/92729928384/how-to-split-a-pdf-files-on-mac-and-linuxunix
---

There are a ton of tools out there for modifying PDF-files. Most of them are crappy, overpriced sharewares from mediocre developers looking to make cash from non-technical users. What most Mac-users perhaps do not know is that Mac OS comes with a ton of handy tools for modifying PDF files. For instance, with a few clicks, you can create an app that merges different PDF files into one file with Automator (I will post that app in a separate post).

One thing that the Mac does not do well though is to split a PDF file. Sure, you can “Print to PDF” and simply select the pages you wish to print. This works great if you’re only looking to split one file. If you have, let’s say 100 documents you wish to split, it’s not a very desirable approach. That’s where the handy toolkit [Ghostscript](http://pages.cs.wisc.edu/~ghost/) comes into play. Most Unix/Linux users have probably encountered it at one point or another (or at least seen the package being installed), as it is widely used in the the Unix/Linux world under the hood.

Since Mac OS X is really originates from FreeBSD, we can easily tap into the wealth of Unix/Linux tools. I’m not going to get into the details on how to install Ghostscript on Mac OS X, as there are many ways of doing this (I personally prefer using [Homebrew](http://github.com/mxcl/homebrew), but you can as well use [Fink](http://www.finkproject.org/) or [MacPort](http://www.macports.org/)).

If you’re on Unix or Linux, chances are you already have Ghostscript installed.

Once you have Ghostscript installed, you can use this simple script.

    #!/bin/bash  
    \# Usage ./pdfsplitr.sh inputfile.pdf outputfile.pdf pagenumber  
    \# Example: ./pdfsplitr.sh myfile.pdf myotherfile.pdf 2

    GS=$(which gs)

    \# Make sure Ghostscript is installed  
    if \[\[ $GS = “” \]\]  
    then  
    echo “Ghostscript is not installed”  
    exit  
    fi

    \# Run the actual conversion.  
    $GS -sDEVICE=pdfwrite -q -dNOPAUSE -dBATCH -sOutputFile=$2 -dFirstPage=$3 -dLastPage=$3 $1

The usage is really simple, if you save the script to ‘pdfsplitr.sh’, all you need to do (in addition to making it executable with ‘chmod +x pdfsplitr.sh’) is to provide it with the file you wish to split, the output-file and the page number, like this:

    ./pdfsplitr.sh myoriginal.pdf mysplittedfile.pdf 2

Enjoy!
