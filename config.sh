#! /bin/bash

USAGE="config <prod | beta      hw | tg | cx | sp | id | va>"
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "$USAGE"
    exit 1
fi

if [ "$1" = "beta" ]; then 
    VARS=./sitevars_beta.sh
fi

if [ "$1" == "prod" ]; then 
    VARS=./sitevars.sh
fi

source "$VARS"

if [ -z "$SITE" ]; then echo "no SITE"; exit; fi
if [ -z "$APP" ]; then echo "no APP"; exit; fi

echo Config: "$APP"
scp src/config/config-"$2".json "$SITE":public_html/"$APP"/config/config.json
