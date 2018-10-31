#!/usr/bin/env bash

if [[ -z "$1" ]]; then
 echo -e "The script checks if given URI (Uniform Resource Identifier) is responding HTTP status code 200\n
 URI = http(s)://example.com:8042/over/there?name=ferret#nose
        \_____/\_________________/\_________/\_________/\__/
            |           |               |         |      |
         scheme     authority          path     query  fragment
            |   ________________________|__
           / \ /                           \\
           urn:example:animal:ferret:nose\n"
  echo "Usage: ./check-http-response.sh <URI> <EXPECTED HTTP CODE>"
 exit 1
fi

if [[ -z "$2" ]]; then
 echo -e "No expected http code given!\n"
  echo "Usage: ./check-http-response.sh <URI> <EXPECTED HTTP CODE>"
 exit 1
fi

echo "CHECK if $1 is up"
expectedHttpCode=$2
testHttpCode=$(curl -sL -w '%{http_code}' $1 -o /dev/null 2>&1 | grep ${expectedHttpCode})

if [ "$testHttpCode" != "${expectedHttpCode}" ]; then
  echo -e "\n\n\n ERROR - no HTTP status code ${expectedHttpCode} received! \n\n\n"
  exit 1
fi

echo "HTTP status code ${expectedHttpCode} received"

