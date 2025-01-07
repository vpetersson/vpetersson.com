---
layout: post
title: Quickly navigate folders in your shell with `ccd`
date: '2015-10-24T15:06:11+03:00'
tags:
- bash
- life-hacks
- geek
- shell
redirect_from: /post/131808587894/quickly-navigate-folders-in-your-shell-with-ccd
---
I’m a huge fan of [autojump](https://github.com/wting/autojump). It allows me to quickly navigate my filesystem in ways without having to type out every folder.

There is however one task that I frequently that I wanted to make more efficient: create a new folder and then jump into said folder.

Normally, this would simply be:

    mkdir foo
    cd foo

This feels somewhat inefficient, so I wrote a little tool to help with this called `ccd`:

    ccd foo

The tool is very simple, but saves me a number of keystrokes every day. There are two pieces to the tool: one bash script and one entry in `~/.profile`.

### ~/bin/ccd.sh

    #!/bin/bash

    ARG="$1"
    if [ ! -d "$ARG"  ]; then
        echo "Creating $ARG."
        mkdir -p "$(pwd)/$ARG"
    else
        echo "$ARG already exists."
    fi

    cd "$(pwd)/$1"

Once you have installed the script, just set the right permission with `chmod +x ~/bin/ccd.sh`

### ~/.profile

Lastly, you will need to add the following entry to your `~/.profile` file:

    alias ccd="source ~/bin/ccd.sh"

Finally, either reload your shell, or run `source ~/.profile`.

    cd /usr/local/src/
    git clone https://github.com/vpetersson/ccd.git
    cd ccd
    sudo make install
