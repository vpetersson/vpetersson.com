# frozen_string_literal: true

module Jekyll
  # Filter to convert time format to ISO 8601 duration format
  module VideoDurationFilter
    def to_iso8601_duration(input)
      minutes, seconds = input.to_s.split(':').map(&:to_i)
      seconds ||= 0

      total_seconds = (minutes * 60) + seconds
      hours = total_seconds / 3600
      minutes = (total_seconds % 3600) / 60
      seconds = total_seconds % 60

      build_duration_string(hours, minutes, seconds)
    end

    private

    def build_duration_string(hours, minutes, seconds)
      duration = 'PT'
      duration += "#{hours}H" unless hours.zero?
      duration += "#{minutes}M" unless minutes.zero?
      duration += "#{seconds}S" unless seconds.zero?
      duration
    end
  end
end

Liquid::Template.register_filter(Jekyll::VideoDurationFilter)
