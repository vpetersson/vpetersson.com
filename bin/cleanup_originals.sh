#!/bin/bash

# Function to remove original file if WebP exists
remove_if_webp_exists() {
    local file="$1"
    local webp_file="${file%.*}.webp"

    if [ -f "$webp_file" ]; then
        echo "Removing $file (WebP version exists at $webp_file)"
        rm "$file"
    fi
}

# Find all JPG/JPEG/PNG files, excluding _site directory
find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -not -path "./_site/*" -not -path "./node_modules/*" | while read -r file; do
    remove_if_webp_exists "$file"
done