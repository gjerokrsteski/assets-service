#!/bin/sh
set -e
yarn run start & echo $! >./pidfile
