# frozen_string_literal: true

module Jekyll
  # Filter to extract YouTube video ID from various URL formats
  module YouTubeIDFilter
    YOUTUBE_URL_PATTERN = %r{
      (?:youtube\.com/(?:
        watch\?v=|
        embed/|
        v/|
        .*/|
        attribution_link\?.*v%3D|
        .*/\?.*v=|
        shorts/|
        .*/shorts/|
        .*v/|
        .*live/|
        .*watch/
      )|
      youtu\.be/)
      ([a-zA-Z0-9_-]{11})
    }x

    def extract_youtube_id(url)
      match = url.match(YOUTUBE_URL_PATTERN)
      match[1] if match
    end
  end
end

Liquid::Template.register_filter(Jekyll::YouTubeIDFilter)
