# frozen_string_literal: true

# Generate tag pages for posts
Jekyll::Hooks.register :posts, :post_write do |post|
  all_existing_tags = Dir.entries('_tags')
                        .map { |t| t.match(/(.*).md/) }
                        .compact
                        .map { |m| m[1] }

  tags = post['tags'].reject(&:empty?)
  tags.each do |tag|
    hyphenated_tag = tag.tr(' ', '-')
    generate_tag_file(tag, hyphenated_tag) unless all_existing_tags.include?(hyphenated_tag)
  end
end

private

def generate_tag_file(tag, hyphenated_tag)
  File.open("_tags/#{hyphenated_tag}.md", 'wb') do |file|
    file << "---\n" \
            "layout: tags\n" \
            "tag-name: #{tag}\n" \
            "---\n"
  end
end
