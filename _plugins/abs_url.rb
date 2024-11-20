# frozen_string_literal: true

module Jekyll
  # Filter to convert relative URLs to absolute URLs
  module AbsoluteUrlFilter
    def absolute_url(input)
      site_url = @context.registers[:site].config['url']
      "#{site_url}#{input}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::AbsoluteUrlFilter)
