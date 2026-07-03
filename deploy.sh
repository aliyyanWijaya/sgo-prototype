#!/bin/bash
set -e
echo "Building..."
npx expo export -p web
echo "Deploying..."
npx netlify-cli deploy --prod --dir=dist
echo "Done!"
