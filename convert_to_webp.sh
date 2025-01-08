#!/bin/bash

# Function to convert a single image to WebP
convert_to_webp() {
    input_file="$1"
    output_file="${input_file%.*}.webp"

    # Skip if WebP version already exists and is newer than original
    if [ -f "$output_file" ] && [ "$output_file" -nt "$input_file" ]; then
        echo "Skipping $input_file (WebP version is up to date)"
        return
    }

    echo "Converting $input_file to WebP..."

    # Different quality settings based on input format
    case "${input_file,,}" in
        *.png)
            # Use lossless for PNG files
            cwebp -lossless "$input_file" -o "$output_file"
            ;;
        *.jpg|*.jpeg)
            # Use quality 80 for JPEG files (good balance between quality and size)
            cwebp -q 80 "$input_file" -o "$output_file"
            ;;
    esac

    # Check if conversion was successful
    if [ $? -eq 0 ]; then
        echo "Successfully converted $input_file"

        # Compare sizes
        original_size=$(stat -f %z "$input_file")
        webp_size=$(stat -f %z "$output_file")

        echo "Original size: $(($original_size/1024))KB"
        echo "WebP size: $(($webp_size/1024))KB"
        echo "Saved: $((($original_size-$webp_size)/1024))KB"
        echo "---"
    else
        echo "Failed to convert $input_file"
        # Remove failed conversion if it exists
        [ -f "$output_file" ] && rm "$output_file"
    fi
}

# Find and convert all JPG, JPEG, and PNG files in assets directory
find assets -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) | while read -r file; do
    convert_to_webp "$file"
done

echo "Conversion complete!"