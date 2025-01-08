module Jekyll
  class WebPPictureTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup.strip
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

        # Create WebP path
        webp_path = path.sub(/\.(jpg|jpeg|png)$/i, '.webp')

        # Build the picture tag
        picture = "<picture>\n"
        picture += "  <source srcset=\"#{webp_path}\" type=\"image/webp\">\n"
        picture += "  <img src=\"#{path}\" alt=\"#{alt}\" class=\"#{css_class}\">\n"
        picture += "</picture>"

        picture
      else
        "Error processing input, expected syntax: {% picture [path] [alt] [class] %}"
      end
    end
  end
end

Liquid::Template.register_tag('picture', Jekyll::WebPPictureTag)