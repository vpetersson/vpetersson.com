module Jekyll
  module YouTubeIDFilter
    def extract_youtube_id(url)
      # Regex patterns for different YouTube URL formats
      standard_pattern = /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/.*\/|youtube\.com\/attribution_link\?.*v%3D|youtube\.com\/.*\/\?.*v=|youtube\.com\/shorts\/|youtube\.com\/.*\/shorts\/|youtube\.com\/.*v\/|youtube\.com\/.*live\/|youtube\.com\/.*watch\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      match = url.match(standard_pattern)
      match[1] if match
    end
  end
end

Liquid::Template.register_filter(Jekyll::YouTubeIDFilter)
