---
slug: video-to-audio-podcast
title: |
    Nerding Out with Viktor is now available as audio-only, a.k.a Turning my video podcast into an audio podcast
date: '2024-06-27T01:00:00+01:00'
tags:
- podcast
- startup
- entrepreneurship
---

In my previous article, [Launching a Video Podcast in 2024: My Journey and Lessons Learned](/2024/06/20/on-launching-a-video-podcast-in-2024/), I shared my experience of starting a podcast. Since then, I came across some intriguing [research](https://www.thepodcasthost.com/planning/should-i-make-a-video-podcast/) revealing that 43% of podcast listeners prefer audio-only formats. This got me thinking—by offering my podcast solely as a video feed, I might have been missing out on a significant audience. Given that I had already developed my own [podcast RSS generator](https://github.com/vpetersson/podcast-rss-generator/), this presented a perfect chance to nerd out a bit.

Since my podcast RSS generation is already integrated into GitHub Actions, adding an audio-only feed was a straightforward process. Using the ever-reliable `ffmpeg`, I extracted the audio from the video files and repackaged it as an audio-only podcast RSS feed. Surprisingly, it really was that simple. After tweaking the URLs and adjusting the top-level title, I had a fully functional audio-only podcast feed ready for listeners. Best of all, there’s no extra work needed moving forward.

Once the RSS feed was uploaded, the final step was to add it to [Spotify](https://open.spotify.com/show/6pj5BL8V1kLJJzc76MsVqj?si=48213c4556ea4c7b) and [Apple Podcasts](https://podcasts.apple.com/gb/podcast/nerding-out-with-viktor-audio-only/id1765124230) as a new feed—and just like that, it was good to go!

## GitHub Actions workflow

Here's the complete GitHub actions workflow file I'm using for building and generating my podcasts for both video and audio.

```yaml
---
name: Publish nightly

on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master
  schedule:
    - cron: "00 01 * * *"
env:
  XQ_VERSION: 1.2.3
  YQ_VERSION: 4.44.3
  R2_BUCKET: my-r2-bucket
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: |
          sudo apt-get -qq update
          sudo apt-get -qq install yamllint

      - name: Install xq
        run: |
          wget -q https://github.com/sibprogrammer/xq/releases/download/v${XQ_VERSION}/xq_${XQ_VERSION}_linux_amd64.tar.gz
          tar xfz xq_${XQ_VERSION}_linux_amd64.tar.gz

      - name: Ensure example file passes yamllint
        run: |
          yamllint -fgithub -d "{rules: {line-length: false}}" podcast_config.yaml

      - name: Run Podcast RSS Generator
        uses: vpetersson/podcast-rss-generator@master
        with:
          input_file: 'podcast_config.yaml'
          output_file: 'podcast_feed.xml'

      - name: Validate output with xq
        run: |
          cat podcast_feed.xml | ./xq

      - uses: actions/upload-artifact@v4
        with:
          name: podcast_feed.xml
          path: podcast_feed.xml


  build-audio-feed:
    runs-on: ubuntu-latest
    needs: generate-audio
    steps:
      - uses: actions/checkout@v4

      - name: Install yq
        run: |
          wget -q https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_amd64
          mv yq_linux_amd64 yq
          chmod +x yq

      - name: Install xq
        run: |
          wget -q https://github.com/sibprogrammer/xq/releases/download/v${XQ_VERSION}/xq_${XQ_VERSION}_linux_amd64.tar.gz
          tar xfz xq_${XQ_VERSION}_linux_amd64.tar.gz

      - name: Generate audio-only feed
        run: |
          cp podcast_config.yaml podcast_config_audio.yaml
          ./yq eval '.metadata.title = .metadata.title + " (audio only)"' -i podcast_config_audio.yaml
          sed -i -E 's|(https://podcast\.nerdingoutwithviktor\.com/S[0-9]{2}E[0-9]{2})\.mp4|\1.mp3|g' podcast_config_audio.yaml

      - name: Run Podcast RSS Generator
        uses: vpetersson/podcast-rss-generator@master
        with:
          input_file: 'podcast_config_audio.yaml'
          output_file: 'podcast_feed_audio.xml'

      - name: Validate output with xq
        run: |
          cat podcast_feed_audio.xml | ./xq

      - uses: actions/upload-artifact@v4
        with:
          name: podcast_feed_audio.xml
          path: podcast_feed_audio.xml


  generate-audio:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install yq
        run: |
          wget -q https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_amd64
          mv yq_linux_amd64 yq
          chmod +x yq

      - name: Install dependencies
        run: |
          sudo apt-get -qq update
          sudo apt-get -qq install ffmpeg curl

      - name: Generate audio-only files
        run: |
          for url in $(yq eval '.episodes[].asset_url' "podcast_config.yaml"); do
            echo "Processing URL: $url"
            audio_url="${url%.mp4}.mp3"
            video_url="$url"

            if curl --output /dev/null --silent --head --fail "$audio_url"; then
              echo "$url already exists."
            else
              echo "$url does not exist. Converting $video_url to mp3..."

              ffmpeg -i "$video_url" $(basename $audio_url)

              echo "Conversion complete: $video_url"
            fi
          done

      - name: Install mc
        run: |
          wget -q https://dl.min.io/client/mc/release/linux-amd64/mc
          chmod +x mc

      - name: Set up mc
        env:
          R2_ENDPOINT: ${{ secrets.R2_ENDPOINT }}
          R2_KEY_ID: ${{ secrets.R2_KEY_ID }}
          R2_KEY_SECRET: ${{ secrets.R2_KEY_SECRET }}
        run: ./mc alias set r2-nowv ${R2_ENDPOINT} ${R2_KEY_ID} ${R2_KEY_SECRET}

      - name: Copy converted MP3s
        run: |
          for file in *.mp3; do
            if [ -f "$file" ]; then
              ./mc cp "$file" r2-nowv/${R2_BUCKET}/
            fi
          done

  deploy:
    runs-on: ubuntu-latest
    needs:
    - build
    - build-audio-feed
    if: github.ref == 'refs/heads/master'
    steps:
      - uses: actions/download-artifact@v4

      - name: Install mc
        run: |
          wget -q https://dl.min.io/client/mc/release/linux-amd64/mc
          chmod +x mc

      - name: Set up mc
        env:
          R2_ENDPOINT: ${{ secrets.R2_ENDPOINT }}
          R2_KEY_ID: ${{ secrets.R2_KEY_ID }}
          R2_KEY_SECRET: ${{ secrets.R2_KEY_SECRET }}
        run: ./mc alias set r2-nowv ${R2_ENDPOINT} ${R2_KEY_ID} ${R2_KEY_SECRET}

      - name: Copy podcast feed
        run: ./mc cp podcast_feed.xml/podcast_feed.xml r2-nowv/${R2_BUCKET}/

      - name: Copy audio podcast
        run: ./mc cp podcast_feed_audio.xml/podcast_feed_audio.xml r2-nowv/${R2_BUCKET}/
```
