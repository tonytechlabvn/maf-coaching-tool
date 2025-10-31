#!/bin/sh

# Check if the API_KEY environment variable is set
if [ -z "$API_KEY" ]; then
  echo "Error: API_KEY environment variable not set." >&2
  exit 1
fi

# Target file to modify
TARGET_FILE="/usr/share/nginx/html/services/geminiService.ts"

# Perform the substitution
sed -i "s/__GEMINI_API_KEY__/${API_KEY}/g" "$TARGET_FILE"

# Execute the command passed as arguments to the entrypoint, which should be Nginx
exec "$@"
