#!/bin/bash

# Function to update image references in a file
update_refs() {
    local file="$1"
    echo "Processing $file..."

    # Create a temporary file
    temp_file=$(mktemp)

    # Replace image extensions while preserving the rest of the path, but only for local assets
    sed -E 's/(\/(assets|tumblr_files)\/[^"'\'']*)\.(jpg|jpeg|png)([^a-zA-Z0-9]|$)/\1\.webp\4/g' "$file" > "$temp_file"

    # Compare files and only update if there are changes
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        echo "Updated $file"
    else
        rm "$temp_file"
        echo "No changes needed in $file"
    fi
}

# Find all markdown and HTML files, excluding _site directory
find . -type f \( -name "*.md" -o -name "*.html" \) -not -path "./_site/*" | while read -r file; do
    update_refs "$file"
done