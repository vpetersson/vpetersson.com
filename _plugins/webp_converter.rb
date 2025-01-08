require 'fileutils'

module Jekyll
  class WebPConverter < Generator
    safe true
    priority :low

    def generate(site)
      # Get the site source directory
      source = site.source

      # Find all image files in assets
      Dir.glob(File.join(source, 'assets', '**', '*.{jpg,jpeg,png}')) do |img|
        # Get the relative path from source
        rel_path = img.sub(source + '/', '')

        # Create WebP path
        webp_path = img.sub(/\.(jpg|jpeg|png)$/i, '.webp')
        rel_webp_path = webp_path.sub(source + '/', '')

        # Skip if WebP exists and is newer than source
        if File.exist?(webp_path) && File.mtime(webp_path) >= File.mtime(img)
          Jekyll.logger.debug "WebP Converter:", "Skipping #{rel_path} (up to date)"
          next
        end

        Jekyll.logger.info "WebP Converter:", "Converting #{rel_path}"

        # Determine quality settings based on input format
        quality_arg = img.downcase.end_with?('.png') ? '-lossless' : '-q 80'

        # Convert to WebP
        system("cwebp #{quality_arg} \"#{img}\" -o \"#{webp_path}\"")

        if $?.success?
          # Add the WebP file to Jekyll's static files
          site.static_files << Jekyll::StaticFile.new(
            site,
            source,
            File.dirname(rel_webp_path),
            File.basename(rel_webp_path)
          )

          # Log size comparison
          orig_size = File.size(img)
          webp_size = File.size(webp_path)
          saved = orig_size - webp_size
          Jekyll.logger.info "WebP Converter:", "Saved #{(saved.to_f / 1024).round(2)}KB for #{rel_path}"
        else
          Jekyll.logger.error "WebP Converter:", "Failed to convert #{rel_path}"
          FileUtils.rm_f(webp_path)
        end
      end
    end
  end
end