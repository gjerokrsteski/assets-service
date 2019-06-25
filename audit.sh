#!/usr/bin/env sh
set -e
yarn upgrade
yarn audit fix --only=prod --registry=https://registry.npmjs.org
