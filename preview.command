#!/bin/sh
cd "$(dirname "$0")"
open http://127.0.0.1:18473
python3 -m http.server 18473 --bind 127.0.0.1
