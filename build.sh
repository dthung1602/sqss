#!/usr/bin/env sh

echo "---- Build start ----"

# quit on error
set -e

PRJ_ROOT=$(dirname "$0")
cd "$PRJ_ROOT"

echo "---- Removing old build ----"
rm -rf "dist"

echo "---- Building module ----"
tsc
echo "---- Building bundle ----"
webpack

echo "---- Build finished ----"
