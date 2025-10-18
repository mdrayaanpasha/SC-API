#!/bin/zsh
setopt extended_glob
setopt nullglob

BASE_DIR="public/img/SR"

for type_dir in "$BASE_DIR"/*; do
  if [ -d "$type_dir" ]; then
    for product_dir in "$type_dir"/*; do
      if [ -d "$product_dir" ]; then
        product_id=$(basename "$product_dir")
        echo "Product ID: $product_id"

        for img in "$product_dir"/*.{jpg,jpeg,png,webp}; do
          [[ -e "$img" ]] && echo "  ${img#public/}"
        done
      fi
    done
  fi
done

