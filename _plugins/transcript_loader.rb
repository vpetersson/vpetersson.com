module Jekyll
  module TranscriptLoader
    def load_transcript(episode_path)
      # Extract episode number (e.g., s01e14 from _podcast/S01E14.md)
      episode_number = File.basename(episode_path, '.*').downcase

      # Build the transcript path (absolute, based on site source)
      site_source = @context.registers[:site].source
      transcript_path = File.join(site_source, '_transcript', "#{episode_number}.json")

      # Check if file exists
      unless File.exist?(transcript_path)
        Jekyll.logger.warn "TranscriptLoader:", "No transcript found for #{episode_number}"
        return []
      end

      begin
        require 'json'
        transcript_data = JSON.parse(File.read(transcript_path))

        # Convert the JSON data into our desired format
        transcript_data.map do |entry|
          {
            'timestamp' => entry['startTime'],
            'speaker' => entry['speaker_name'],
            'text' => entry['sentence']
          }
        end
      rescue JSON::ParserError => e
        Jekyll.logger.error "TranscriptLoader:", "Failed to parse JSON for #{episode_number}: #{e.message}"
        []
      rescue StandardError => e
        Jekyll.logger.error "TranscriptLoader:", "Error loading #{episode_number}: #{e.message}"
        []
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::TranscriptLoader)