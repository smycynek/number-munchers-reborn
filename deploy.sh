#! /bin/bash

rm -rf dist # Remove old build

# Bump version
VERSION_PATH="./src/app/version.ts"
version=$(grep -o -m 1 "[0-9][0-9][0-9]" $VERSION_PATH)
echo $version
echo $version
version_inc=$((version+1))
echo $version_inc
sed -i -e "s/[0-9][0-9][0-9]/$version_inc/g" $VERSION_PATH

rm "$VERSION_PATH-e"

# build
npx ng build  --configuration=production --base-href /$APP/

# rename output folder
mv dist/$FOLDER/browser dist/$FOLDER/$APP

cd dist/$FOLDER

# compress output
zip -vr  $APP.zip $APP -x $APP/assets/preview-number-munchers.png

# copy zip to site
scp $APP.zip $SITE:public_html

# unzip zip at site, exit
export SHELL_COMMAND="cd public_html; rm -rf $APP;  unzip $APP.zip; exit; bash"
echo $SHELL_COMMAND
ssh -t $SITE $SHELL_COMMAND
cd ../..