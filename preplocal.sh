#! /bin/bash

if ! which "bun" >/dev/null; then
    echo "bun not found."
    exit 1
fi
rm -rf dist

bun ng build --configuration=beta

cd dist/number-munchers/browser || exit
bun serve .
