#! /bin/bash
rm -rf dist



npx ng build  --configuration=production

cd dist/number-munchers/browser
serve .


