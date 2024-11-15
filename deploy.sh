#! /bin/bash

USAGE="config [prod | beta]"
if [ -z "$1" ]; then
    echo "$USAGE"
    exit 1
fi

if [ "$1" = "beta" ]; then
    VARS=./sitevars_beta.sh
elif [ "$1" == "prod" ]; then
    VARS=./sitevars.sh # user-supplied vars for SITE, APP, and FOLDER
else
    echo "$USAGE"
    exit 1
fi

if [ ! -f "$VARS" ]; then
   echo "You must supply app environment variables in $VARS to deploy"
   exit 2
fi

source "$VARS"

if [ -z "$SITE" ]; then
    echo "no SITE"
    exit
fi
if [ -z "$APP" ]; then
    echo "no APP"
    exit
fi
if [ -z "$FOLDER" ]; then
    echo "no FOLDER"
    exit
fi

tools=("zip" "scp" "ssh" "npm" "npx" "sed")

for tool in "${tools[@]}"; do
    if ! which "$tool" >/dev/null; then
        echo "$tool" not found
        exit 3
    fi
done

rm -rf dist # Remove old build

# Bump version
VERSION_PATH="./src/app/version.ts"
version=$(grep -o -m 1 "[0-9][0-9][0-9]" "$VERSION_PATH")
echo "$version"
version_inc=$((version + 1))
echo "$version_inc"
sed -i -e "s/[0-9][0-9][0-9]/$version_inc/g" "$VERSION_PATH"

rm "$VERSION_PATH-e"

# build
npx ng build --configuration=production --base-href /"$APP"/

# rename output folder
mv dist/"$FOLDER"/browser dist/"$FOLDER"/"$APP"

cd dist/"$FOLDER" || exit

# compress output
zip -vr "$APP".zip "$APP" -x "$APP"/assets/preview-number-munchers.png

# copy zip to site
scp "$APP".zip "$SITE":public_html

# unzip zip at site, exit
export SHELL_COMMAND="cd public_html; rm -rf $APP;  unzip $APP.zip; exit; bash"
echo "$SHELL_COMMAND"
ssh -t "$SITE" "$SHELL_COMMAND"
cd ../..
echo "$version_inc"
