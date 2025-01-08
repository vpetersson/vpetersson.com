require 'fileutils'
require 'jekyll'
require 'set'

module Jekyll
  class WebPConverter < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      @processed_files ||= Set.new

      # Create cache directory
      cache_dir = File.join(site.source, '.webp-cache')
      FileUtils.mkdir_p(cache_dir)

      # Get source directory
      source = site.source

      # Find all images
      Dir.glob(File.join(source, "**", "*.{jpg,jpeg,png}")).each do |img|
        next if img.include?('/vendor/') ||
                img.include?('/node_modules/') ||
                img.include?('/_tags/') ||
                img.include?('/_site/')

        rel_path = img.sub(source + '/', '')
        webp_path = rel_path.sub(/\.(jpg|jpeg|png)$/i, '.webp')
        cache_path = File.join(cache_dir, webp_path)

        # Skip if we've already processed this file in this run
        next if @processed_files.include?(cache_path)
        @processed_files.add(cache_path)

        # Ensure cache subdirectory exists
        FileUtils.mkdir_p(File.dirname(cache_path))

        # Skip if WebP exists in cache and is newer than source
        if File.exist?(cache_path) && File.mtime(cache_path) >= File.mtime(img)
          Jekyll.logger.debug "WebP Converter:", "Using cached version for #{rel_path}"
        else
          Jekyll.logger.info "WebP Converter:", "Converting #{rel_path}"

          # Get original file size
          orig_size = File.size(img)

          # Determine quality based on file size
          quality_arg = orig_size > 1_000_000 ? "-q 80" : "-lossless"

          # Convert to WebP
          system("cwebp #{quality_arg} \"#{img}\" -o \"#{cache_path}\"")

          unless $?.success?
            Jekyll.logger.error "WebP Converter:", "Failed to convert #{rel_path}"
            next
          end

          # Log compression stats
          webp_size = File.size(cache_path)
          saved = orig_size - webp_size
          Jekyll.logger.info "WebP Converter:", "Saved #{(saved.to_f / 1024).round(2)}KB for #{rel_path}"
        end

        # Add the WebP file to Jekyll's static files for copying to _site
        site.static_files << Jekyll::StaticFile.new(
          site,
          cache_dir,
          File.dirname(webp_path),
          File.basename(webp_path)
        )
      end
    end
  end
end