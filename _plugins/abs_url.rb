# _plugins/absolute_url_filter.rb
module Jekyll
  module AbsoluteUrlFilter
    def absolute_url(input)
      site_url = @context.registers[:site].config['url']
      "#{site_url}#{input}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::AbsoluteUrlFilter)
