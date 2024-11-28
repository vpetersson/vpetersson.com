module Jekyll
  module TranscriptLoader
    def load_transcript(episode_path)
      # Debug the input
      Jekyll.logger.info "TranscriptLoader:", "Input path: #{episode_path}"

      # Extract episode number (e.g., s01e14 from _podcast/S01E14.md)
      episode_number = File.basename(episode_path, '.*').downcase
      Jekyll.logger.info "TranscriptLoader:", "Looking for episode: #{episode_number}"

      # Build the transcript path
      site_source = Jekyll.configuration({})['source']
      transcript_path = File.join(site_source, '_transcript', "#{episode_number}.json")
      Jekyll.logger.info "TranscriptLoader:", "Full transcript path: #{transcript_path}"

      # Check if file exists
      unless File.exist?(transcript_path)
        Jekyll.logger.warn "TranscriptLoader:", "No transcript found at #{transcript_path}"
        return []
      end

      begin
        require 'json'
        transcript_data = JSON.parse(File.read(transcript_path))
        Jekyll.logger.info "TranscriptLoader:", "Successfully loaded #{transcript_data.length} entries"

        # Convert the JSON data into our desired format
        transcript_data.map do |entry|
          {
            'timestamp' => entry['startTime'],
            'speaker' => entry['speaker_name'],
            'text' => entry['sentence']
          }
        end
      rescue JSON::ParserError => e
        Jekyll.logger.error "TranscriptLoader:", "Failed to parse JSON: #{e.message}"
        []
      rescue StandardError => e
        Jekyll.logger.error "TranscriptLoader:", "Error: #{e.message}"
        []
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::TranscriptLoader)