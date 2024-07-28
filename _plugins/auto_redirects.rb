# _plugins/auto_redirects.rb

module Jekyll
  class AutoRedirectGenerator < Generator
    safe true
    priority :low

    def generate(site)
      site.posts.docs.each do |post|
        date = post.date
        # Access slug from the data hash
        slug = post.data['slug'] || post.basename_without_ext
        # Construct the old URL
        old_url = date.strftime('/%Y/%m/%d/') + slug + ".html"

        # Add the old URL to the redirect_from array
        post.data['redirect_from'] ||= []
        post.data['redirect_from'] << old_url
      end
    end
  end
end

