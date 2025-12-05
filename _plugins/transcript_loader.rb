module Jekyll
  module TranscriptLoader
    def load_transcript(episode_path)
      # Extract episode number (e.g., s01e14 from _podcast/S01E14.md)
      episode_number = File.basename(episode_path, '.*').downcase

      # Build the transcript path (absolute, based on site source)
      site_source = @context.registers[:site].source
      transcript_dir = File.join(site_source, '_transcript')

      # Find the file case-insensitively to handle filesystem differences
      transcript_filename = nil
      if File.directory?(transcript_dir)
        transcript_filename = Dir.entries(transcript_dir).find do |entry|
          entry.downcase == "#{episode_number}.json"
        end
      end

      # Check if file exists
      unless transcript_filename
        Jekyll.logger.warn "TranscriptLoader:", "No transcript found for #{episode_number}"
        return []
      end

      transcript_path = File.join(transcript_dir, transcript_filename)

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

  class TranscriptFile < StaticFile
    def initialize(site, base, dir, name, dest_dir, dest_name)
      super(site, base, dir, name)
      @dest_dir = dest_dir
      @dest_name = dest_name
    end

    def destination(dest)
      File.join(dest, @dest_dir, @dest_name)
    end
  end

  class TranscriptGenerator < Generator
    safe true
    priority :low

    def generate(site)
      src_dir = '_transcript'
      dest_dir = 'transcript'
      full_src_dir = File.join(site.source, src_dir)

      return unless File.directory?(full_src_dir)

      Dir.foreach(full_src_dir) do |entry|
        next if entry == '.' || entry == '..'
        next unless entry.downcase.end_with?('.json')

        site.static_files << TranscriptFile.new(
          site,
          site.source,
          src_dir,
          entry,
          dest_dir,
          entry.downcase
        )
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::TranscriptLoader)
