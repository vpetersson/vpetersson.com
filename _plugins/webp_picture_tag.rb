module Jekyll
  class WebPPictureTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup
    end

    def render(context)
      # Parse the markup
      if @markup =~ /^\s*(\S+)(?:\s+(\S+))?(?:\s+(\S+))?\s*$/
        path = $1
        alt = $2 || ''
        css_class = $3 || ''

        # Remove quotes if present
        path = path.gsub(/^['"]|['"]$/, '')
        alt = alt.gsub(/^['"]|['"]$/, '')
        css_class = css_class.gsub(/^['"]|['"]$/, '')

        # Get the site source directory
        site = context.registers[:site]
        source = site.source

        # Create WebP path with same structure as original
        webp_path = path.sub(/\.(jpg|jpeg|png)$/i, '.webp')

        # Build the picture tag
        picture = "<picture>\n"
        if File.exist?(File.join(source, '.webp-cache', webp_path))
          picture += "  <source srcset=\"#{webp_path}\" type=\"image/webp\">\n"
        end
        picture += "  <img src=\"#{path}\" alt=\"#{alt}\" class=\"#{css_class}\" loading=\"lazy\">\n"
        picture += "</picture>"

        picture
      else
        "Error processing input, expected syntax: {% picture [path] [alt] [class] %}"
      end
    end
  end
end

Liquid::Template.register_tag('picture', Jekyll::WebPPictureTag)