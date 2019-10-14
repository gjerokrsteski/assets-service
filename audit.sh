#!/usr/bin/env sh
set -e
npm upgrade
npm audit fix --only=prod --registry=https://registry.npmjs.org
