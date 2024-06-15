Jekyll::Hooks.register :posts, :post_write do |post|
  all_existing_tags = Dir.entries("_tags")
                         .map { |t| t.match(/(.*).md/) }
                         .compact
                         .map { |m| m[1] }

  tags = post['tags'].reject { |t| t.empty? }
  tags.each do |tag|
    hyphenated_tag = tag.gsub(' ', '-')
    generate_tag_file(tag, hyphenated_tag) unless all_existing_tags.include?(hyphenated_tag)
  end
end

def generate_tag_file(tag, hyphenated_tag)
  File.open("_tags/#{hyphenated_tag}.md", "wb") do |file|
    file << "---\nlayout: tags\ntag-name: #{tag}\n---\n"
  end
end
