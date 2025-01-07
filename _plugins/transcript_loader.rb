module Jekyll
  module TranscriptLoader
    def load_transcript(episode_path)
      transcript_path = build_transcript_path(episode_path)
      return [] unless File.exist?(transcript_path)

      begin
        transcript_data = load_json_data(transcript_path)
        format_transcript_data(transcript_data)
      rescue JSON::ParserError => e
        Jekyll.logger.error 'TranscriptLoader:', "Failed to parse JSON: #{e.message}"
        []
      rescue StandardError => e
        Jekyll.logger.error 'TranscriptLoader:', "Error: #{e.message}"
        []
      end
    end

    private

    def build_transcript_path(episode_path)
      episode_number = File.basename(episode_path, '.*').downcase
      Jekyll.logger.info 'TranscriptLoader:', "Looking for episode: #{episode_number}"

      site_source = Jekyll.configuration({})['source']
      transcript_path = File.join(site_source, '_transcript', "#{episode_number}.json")
      Jekyll.logger.info 'TranscriptLoader:', "Full transcript path: #{transcript_path}"
      transcript_path
    end

    def load_json_data(transcript_path)
      require 'json'
      transcript_data = JSON.parse(File.read(transcript_path))
      Jekyll.logger.info 'TranscriptLoader:', "Successfully loaded #{transcript_data.length} entries"
      transcript_data
    end

    def format_transcript_data(transcript_data)
      transcript_data.map do |entry|
        {
          'timestamp' => entry['startTime'],
          'speaker' => entry['speaker_name'],
          'text' => entry['sentence']
        }
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::TranscriptLoader)
