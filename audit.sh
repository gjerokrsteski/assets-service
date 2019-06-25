#!/usr/bin/env sh
set -e
yarn audit fix --only=prod --registry=https://registry.npmjs.org
