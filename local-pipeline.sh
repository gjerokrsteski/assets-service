#!/usr/bin/env bash

. ./ci-scripts/build-functions.sh

./install.sh
assert_exit_code "ERROR integrating dependencies"

./audit.sh
assert_exit_code "ERROR auditing npm packages"

./lint.sh
assert_exit_code "ERROR linting js"

./test.sh
assert_exit_code "ERROR testing units"

./test-integration.sh
assert_exit_code "ERROR testing binary"
