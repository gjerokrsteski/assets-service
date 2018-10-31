#!/usr/bin/env bash

date_format="+%Y-%m-%d_%H-%M-%S%z"

print_info() {
  echo -e "$(date ${date_format}) ### INFO - $1"
}

print_warn() {
  echo -e "$(date ${date_format}) ### WARN - $1"
}

print_error() {
  echo -e "\ņ"
  echo -e "$(date ${date_format}) ### ERROR - $1"
  echo -e "\n"
}

assert_error() {
  print_error "$1"
  exit 1
}

assert_not_empty_string() {
  if [[ -z $1 ]]; then
    assert_error $2
  fi
}

assert_file_exists() {
  if [[ ! -e $1 ]]; then
    assert_error "Could not find file: \"${1}\""
  fi
}

assert_exit_code() {
  local exit_code=$?
  if [[ ${exit_code} -ne 0 ]]; then
    assert_error "$1 (exit code: ${exit_code})"
  fi
}
