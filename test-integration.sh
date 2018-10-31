#!/usr/bin/env bash

. ./ci-scripts/build-functions.sh

print_info "Start server..."
yarn run start -- --port=6767 &
sleep 2

print_info "Test if service responds HTTP 404 at /fonts route if no asset file specified"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/fonts' 404

print_info "Test if service responds HTTP 200 at /fonts/test.txt route"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/fonts/test.txt' 200

print_info "Test if service responds HTTP 200 and file contests at route /fonts/test.txt"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/fonts/test.txt' "test OK"

print_info "Test if service responds HTTP 200 at /img/icons/test.txt route"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/img/icons/test.txt' 200

print_info "Test if service responds HTTP 200 and file contests at route /img/icons/test.txt"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/img/icons/test.txt' "test OK"

print_info "Test if service responds HTTP 404 at home route if no URL params given"
./health-check-scripts/check-http-response.sh 'http://localhost:6767' 404

print_info "Test if service responds HTTP 404 at unknown route and user friendly message is displayed"
./health-check-scripts/check-http-output.sh 'http://localhost:6767' "Invalid Request"

print_info "Test if service responds HTTP 404 at unknown route and user friendly message is displayed at route /embed"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/embed' "Invalid Request"

print_info "Test if service responds HTTP 200 at home route using expected URL parameters"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/?config_id=Demo&dom_id=test' 200

print_info "Test if service responds HTTP 200 at /build route"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/build' 200

print_info "Test if service responds HTTP 200 at /build route and version number '${CI_COMMIT_TAG}' is displayed"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/build' "${CI_COMMIT_TAG}"

print_info "Test if service responds HTTP 404 at /embed route using expected URL parameters with invalid value"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/embed?dom_id=test&dom_id=Demo' 404

print_info "Test if service responds HTTP 404 at unknown route"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/some-bad-segment' 404

print_info "Test if service responds HTTP 200 at home route using expected URL parameters"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/embed?config_id=Demo&dom_id=test' 200

print_info "Test if service responds HTTP 200 at /embed_test route using expected URL parameters"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/embed_test' 200

print_info "Test if service responds HTTP 200 at /embed_test route using expected URL parameters and setting config_id"
./health-check-scripts/check-http-response.sh 'http://localhost:6767/embed_test?config_id=test' 200

print_info "Test if service responds expected output of bundle file at /embed route"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/embed?dom_id=test&config_id=Demo' "appContainer"

print_info "Test if service responds expected output of bundle file  at / route"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/?dom_id=test&config_id=Demo' "appContainer"

print_info "Test if service responds expected output at /embed_test without GET parameters"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/embed_test' "Demo"

print_info "Test if service responds expected output at /embed_test with GET parameter like 'TEST_CONFIG_ID'"
./health-check-scripts/check-http-output.sh 'http://localhost:6767/embed_test?config_id=TEST_CONFIG_ID' "TEST_CONFIG_ID"

print_info "Test if service responds HTTP 500 at /embed_test route using expected URL parameters and setting config_id"
mv ./public/bundle-0.17.0.js ./public/BAK-bundle-0.17.0.js
./health-check-scripts/check-http-response.sh 'http://localhost:6767/embed/?dom_id=test&config_id=Demo' 500
mv ./public/BAK-bundle-0.17.0.js ./public/bundle-0.17.0.js


print_info "Stop server..."
