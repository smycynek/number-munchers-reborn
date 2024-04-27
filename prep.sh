#! /bin/bash
rm -rf dist

PAGE_PATH="./src/app/numberMunchers.component.html"
version=$(grep -o -m 1 "\|\|v[0-9][0-9][0-9]\|\|" $PAGE_PATH)
echo $version
version=${version:5:3}
echo $version
version_inc=$((version+1))
echo $version_inc
version_inc_full="||v$version_inc||"
echo $version_inc_full
sed -i -e "s/\|\|v[0-9][0-9][0-9]\|\|/$version_inc_full/g" $PAGE_PATH

rm "$PAGE_PATH-e"

ng build  --configuration=production --base-href /number-munchers/

