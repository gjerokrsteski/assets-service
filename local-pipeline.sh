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

./test-integration.sh
assert_exit_code "ERROR testing binary"
