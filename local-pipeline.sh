#!/usr/bin/env bash

. ./ci-scripts/build-functions.sh

npm upgrade
assert_exit_code "ERROR npm upgrade"

./install.sh
assert_exit_code "ERROR integrating dependencies"

./lint.sh
assert_exit_code "ERROR linting js"

./test.sh
assert_exit_code "ERROR testing units"

./test-integration.sh
assert_exit_code "ERROR testing binary"
