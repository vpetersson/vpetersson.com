Jekyll::Hooks.register :site, :post_read do |site|
  # Ensure _tags directory exists
  Dir.mkdir("_tags") unless Dir.exist?("_tags")
  
  all_existing_tags = Dir.entries("_tags")
                         .map { |t| t.match(/(.*).md/) }
                         .compact
                         .map { |m| m[1].downcase }

  # Collect all tags from all posts
  all_tags = site.posts.docs.flat_map { |post| post.data['tags'] || [] }
                             .reject { |t| t.nil? || t.empty? }
                             .uniq

  all_tags.each do |tag|
    hyphenated_tag = tag.gsub(' ', '-').downcase
    generate_tag_file(tag, hyphenated_tag) unless all_existing_tags.include?(hyphenated_tag)
  end
end

def generate_tag_file(tag, hyphenated_tag)
  File.open("_tags/#{hyphenated_tag}.md", "wb") do |file|
    file << "---\nlayout: tags\ntag-name: #{tag}\n---\n"
  end
end
