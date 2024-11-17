#! /bin/bash

if ! which "npx" >/dev/null; then
    echo "npx not found."
    exit 1
fi
rm -rf dist

npx ng build --configuration=beta

cd dist/number-munchers/browser || exit
npx serve .
