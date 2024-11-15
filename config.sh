#! /bin/bash
# Set holiday theme
# (halloween, thanksgiving, christmas, st. patrick's, independence day, valentine's)

USAGE="config [prod | beta] [hw | tg | cx | sp | id | va]"

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "$USAGE"
    exit 1
fi

if [ "$1" = "beta" ]; then
    VARS=./sitevars_beta.sh
fi

if [ "$1" == "prod" ]; then
    VARS=./sitevars.sh # user-supplied vars for SITE and APP
fi

if [ ! -f "$VARS" ]; then
   echo "You must supply app environment variables in $VARS to deploy."
   exit 2
fi

source "$VARS"

if [ -z "$SITE" ]; then
    echo "no SITE"
    exit 3
fi
if [ -z "$APP" ]; then
    echo "no APP"
    exit 3
fi

echo Config: "$APP"
scp src/config/config-"$2".json "$SITE":public_html/"$APP"/config/config.json
