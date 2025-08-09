#!/usr/bin/env bash
set -euo pipefail
docker build -t accounts-vault .
mkdir -p data
docker run --rm -it -p 5177:5177 -v "$(pwd)/data:/app/data" --name accounts-vault accounts-vault
