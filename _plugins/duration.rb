module Jekyll
  module DurationFilter
    def format_duration(minutes)
      mins = minutes.to_i
      hours = mins / 60
      remaining_minutes = mins % 60
      if hours > 0
        "#{hours} hour#{'s' if hours > 1} #{remaining_minutes} min#{'s' if remaining_minutes != 1}"
      else
        "#{remaining_minutes} min#{'s' if remaining_minutes != 1}"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::DurationFilter)
