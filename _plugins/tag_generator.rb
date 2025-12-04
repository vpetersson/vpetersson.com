# frozen_string_literal: true

# Tag Page Generator
#
# Automatically generates tag pages for all tags used in posts.
# Tag pages are created in _tags/ directory and rendered using the 'tags' layout.

module Jekyll
  class TagPageGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      return unless site.layouts.key?('tags')

      # Ensure _tags directory exists
      tags_dir = File.join(site.source, '_tags')
      Dir.mkdir(tags_dir) unless Dir.exist?(tags_dir)

      # Collect all tags from all posts
      all_tags = site.posts.docs
                     .flat_map { |post| post.data['tags'] || [] }
                     .map(&:to_s)
                     .reject(&:empty?)
                     .uniq

      # Get existing tag files
      existing_tags = Dir.entries(tags_dir)
                         .select { |f| f.end_with?('.md') }
                         .map { |f| File.basename(f, '.md').downcase }

      # Generate missing tag files
      new_tags = []
      all_tags.each do |tag|
        tag_slug = tag.gsub(' ', '-').downcase
        next if existing_tags.include?(tag_slug)

        tag_file = File.join(tags_dir, "#{tag_slug}.md")
        File.write(tag_file, tag_page_content(tag, site))
        new_tags << tag_slug
      end

      Jekyll.logger.info 'TagGenerator:', "Generated #{new_tags.size} new tag pages" if new_tags.any?

      # Now manually read and process the tag files as collection documents
      site.collections['tags'].docs.clear if site.collections['tags']
      
      Dir.glob(File.join(tags_dir, '*.md')).each do |tag_file|
        doc = Jekyll::Document.new(
          tag_file,
          site: site,
          collection: site.collections['tags']
        )
        doc.read
        site.collections['tags'].docs << doc
      end
    end

    private

    def tag_page_content(tag, site)
      tag_slug = tag.gsub(' ', '-').downcase
      site_title = site.config['title'] || "Viktor's Tech Musings"
      site_url = site.config['url'] || 'https://vpetersson.com'
      
      <<~CONTENT
        ---
        layout: tags
        tag-name: #{tag}
        title: "#{tag} - Articles and insights | #{site_title}"
        description: "Browse all articles tagged with #{tag}. Expert insights on DevSecOps, cloud architecture, security, and software development."
        permalink: /tags/#{tag_slug}/
        canonical_url: #{site_url}/tags/#{tag_slug}/
        ---
      CONTENT
    end
  end
end
