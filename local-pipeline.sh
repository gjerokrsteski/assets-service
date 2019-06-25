#!/usr/bin/env bash

. ./ci-scripts/build-functions.sh

rm -rf ./node_modules

./install.sh
assert_exit_code "ERROR integrating dependencies"

./lint.sh
assert_exit_code "ERROR linting js"

./audit.sh
assert_exit_code "ERROR auditing js"

./test.sh
assert_exit_code "ERROR testing units"

#export CI_COMMIT_TAG="0.0.0-${RANDOM}"
#sed -i "s|0.0.0|${CI_COMMIT_TAG}|1" ./package.json
#print_info "random commit tag for testing: ${CI_COMMIT_TAG}"
#./compile.sh
#assert_exit_code "ERROR compiling binary"

./test-integration.sh
assert_exit_code "ERROR testing binary"

#print_info "revert random commit tag at package.json"
#sed -i "s|${CI_COMMIT_TAG}|0.0.0|1" ./package.json

