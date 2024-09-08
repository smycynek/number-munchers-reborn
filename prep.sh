#! /bin/bash
rm -rf dist

VERSION_PATH="./src/app/version.ts"
version=$(grep -o -m 1 "[0-9][0-9][0-9]" $VERSION_PATH)
echo $version
echo $version
version_inc=$((version+1))
echo $version_inc
sed -i -e "s/[0-9][0-9][0-9]/$version_inc/g" $VERSION_PATH

rm "$VERSION_PATH-e"

npx ng build  --configuration=production --base-href /number-munchers/

