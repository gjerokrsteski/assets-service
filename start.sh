#!/bin/sh
set -e
npm run start & echo $! >./pidfile
