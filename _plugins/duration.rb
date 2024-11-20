# frozen_string_literal: true

module Jekyll
  # Filter to format duration from minutes into human-readable format
  module DurationFilter
    def format_duration(minutes)
      mins = minutes.to_i
      hours = mins / 60
      remaining_minutes = mins % 60

      return "#{remaining_minutes} min#{'s' if remaining_minutes != 1}" if hours.zero?

      "#{hours} hour#{'s' if hours > 1} #{remaining_minutes} min#{'s' if remaining_minutes != 1}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::DurationFilter)
