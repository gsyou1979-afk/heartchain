#!/bin/bash
# Build script for HeartChain PC web deployment
set -e

echo "=== Building HeartChain PC Frontend (Nuxt) ==="
cd web
npm install
npm run generate
echo "=== Frontend build complete! Output: web/.output/public ==="
