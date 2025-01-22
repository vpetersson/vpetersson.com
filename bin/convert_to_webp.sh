#!/bin/bash

# Function to convert a single image to WebP
convert_to_webp() {
    local input_file="$1"
    local output_file="${input_file%.*}.webp"

    # Skip if WebP version already exists
    if [ -f "$output_file" ]; then
        echo "Skipping $input_file (WebP version already exists)"
        return
    fi

    echo "Converting $input_file to WebP..."
    cwebp -q 80 "$input_file" -o "$output_file"
}

# Find and convert all JPG/JPEG/PNG files
find . -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -not -path "./_site/*" | while read -r file; do
    convert_to_webp "$file"
done