#!/usr/bin/env bash

if [[ -z "$1" || -z "$2"  ]]; then
 echo -e "The script checks the application's HTTP output.\n"
 echo "Usage: ./check-http-output.sh <URI> <EXPECTED STRING>"
 exit 1
fi

URI=$1
EXPECTED_STRING=$2

sleep 1

echo "CHECK if expected string \"$EXPECTED_STRING\" is at HTTP output"

if curl $URI | grep -q "$EXPECTED_STRING"; then
  echo -e "\nOK - expected string \"$EXPECTED_STRING\" was found at HTTP output."
else
  echo -e "\n\n\n ERROR - expected string \"$EXPECTED_STRING\" was not found at HTTP output. \n\n\n"
  exit 1
fi

