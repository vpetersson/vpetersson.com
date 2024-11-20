# frozen_string_literal: true

module Jekyll
  # Filter to calculate and format reading time for content
  module ReadingTimeFilter
    # Average reading speed in words per minute
    WORDS_PER_MINUTE = 183

    def reading_time(input)
      words = input.split.size
      minutes = (words / WORDS_PER_MINUTE.to_f).ceil
      pluralize(minutes, 'minute')
    end

    private

    def pluralize(number, singular, plural = nil)
      return "1 #{singular}" if number == 1

      "#{number} #{plural || "#{singular}s"}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
