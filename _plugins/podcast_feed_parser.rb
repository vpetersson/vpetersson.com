require 'net/http'
require 'rexml/document'
require 'uri'

module Jekyll
  class PodcastFeedParser < Generator
    safe true
    priority :high

    def generate(site)
      # Get the podcast feed URL from main.yml
      feed_url = site.data.dig('main', 'podcast', 'rss')
      return unless feed_url

      begin
        uri = URI.parse(feed_url)
        response = Net::HTTP.get_response(uri)
        doc = REXML::Document.new(response.body)

        # Create a hash to store episode data
        episode_data = {}

        # Parse each item in the feed
        doc.elements.each('//item') do |item|
          # Get episode number from itunes:episode or title
          episode_number = item.elements['itunes:episode']&.text || extract_episode_number(item.elements['title']&.text)
          next unless episode_number

          # Store episode data
          episode_data[episode_number.to_s] = {
            'title' => item.elements['title']&.text,
            'description' => item.elements['description']&.text || item.elements['itunes:summary']&.text,
            'duration' => item.elements['itunes:duration']&.text,
            'published_at' => item.elements['pubDate']&.text,
            'keywords' => item.elements['itunes:keywords']&.text,
            'explicit' => item.elements['itunes:explicit']&.text,
            'episode_type' => item.elements['itunes:episodeType']&.text,
            'season' => item.elements['itunes:season']&.text,
            'image' => item.elements['itunes:image']&.attributes['href'],
            'enclosure' => {
              'url' => item.elements['enclosure']&.attributes['url'],
              'type' => item.elements['enclosure']&.attributes['type'],
              'length' => item.elements['enclosure']&.attributes['length']
            }
          }

          # Try to extract YouTube URL from description or content
          content = item.elements['description']&.text || item.elements['content:encoded']&.text
          youtube_url = extract_youtube_url(content)
          episode_data[episode_number.to_s]['youtube_url'] = youtube_url if youtube_url
        end

        # Make the data available to the site
        site.data['podcast_feed'] = episode_data
      rescue => e
        Jekyll.logger.warn "Podcast Feed Parser:", "Failed to parse feed: #{e.message}"
        site.data['podcast_feed'] = {}
      end
    end

    private

    def extract_episode_number(title)
      return nil unless title
      # Try to extract episode number from common formats like "EP123", "#123", "Episode 123"
      if title =~ /(?:EP|Episode|#)\s*(\d+)/i
        $1.to_i
      end
    end

    def extract_youtube_url(text)
      return nil unless text
      # Match both youtube.com and youtu.be URLs
      if text =~ %r{(?:https?://)?(?:www\.)?(?:youtube\.com/watch\?v=|youtu\.be/)([^&\s]+)}
        "https://www.youtube.com/watch?v=#{$1}"
      end
    end
  end
end