# _plugins/reading_time.rb

module Jekyll
  module ReadingTimeFilter
    # Average reading speed in words per minute
    WORDS_PER_MINUTE = 183

    def reading_time(input)
      words = input.split.size
      minutes = (words / WORDS_PER_MINUTE.to_f).ceil
      pluralize(minutes, "minute")
    end

    private

    def pluralize(number, singular, plural = nil)
      if number == 1
        "1 #{singular}"
      else
        "#{number} #{plural || singular + 's'}"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ReadingTimeFilter)
