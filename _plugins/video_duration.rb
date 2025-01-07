# _plugins/duration_filter.rb

module Jekyll
  module VideoDurationFilter
    # Convert minutes and seconds to ISO 8601 duration format
    def to_iso8601_duration(input)
      input = input.to_s
      minutes, seconds = input.split(':').map(&:to_i)

      # Default seconds to 0 if not provided
      seconds ||= 0

      total_seconds = (minutes * 60) + seconds
      hours = total_seconds / 3600
      minutes = (total_seconds % 3600) / 60
      seconds = total_seconds % 60

      duration = 'PT'
      duration += "#{hours}H" if hours.positive?
      duration += "#{minutes}M" if minutes.positive?
      duration += "#{seconds}S" if seconds.positive?

      duration
    end
  end
end

Liquid::Template.register_filter(Jekyll::VideoDurationFilter)
