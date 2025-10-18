#!/bin/zsh
setopt extended_glob  # enable advanced globbing

# Base directory
BASE_DIR="public/img/SR"

# Loop through all sofa type folders
for type_dir in "$BASE_DIR"/*; do
  if [ -d "$type_dir" ]; then
    # Loop through all product ID folders
    for product_dir in "$type_dir"/*; do
      if [ -d "$product_dir" ]; then
        product_id=$(basename "$product_dir")
        echo "Product ID: $product_id"
        
        # Loop through all image files
        for img in "$product_dir"/*(.jpg|.jpeg|.png|.webp); do
          if [ -e "$img" ]; then
            echo "  $img"
          fi
        done
      fi
    done
  fi
done

