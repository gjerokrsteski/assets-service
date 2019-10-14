#!/usr/bin/env bash
set -e
. ./ci-scripts/build-functions.sh

print_info "start compiling"
NODE_ENV=production npm run compile

print_info "check if expected cli-apps has been built"
assert_file_exists "$(pwd)/production/bin/asset-server-linux"
assert_file_exists "$(pwd)/production/bin/asset-server-macos"
assert_file_exists "$(pwd)/production/bin/asset-server-win.exe"
