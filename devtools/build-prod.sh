#!/usr/bin/env bash
# This script has to be run from ./devtools/build-prod.sh
rm -rf build/release
# Build client code
./node_modules/.bin/webpack --env prod --progress --colors --config devtools/webpack/webpack.config.client.all.js
# Build server code
./node_modules/.bin/babel server -d build/release/server --copy-files
# Install node modules
cd /work/www.node-modules/www/prod
./npminstall.sh
cd -
ln -s /work/www.node-modules/www/prod/node_modules /work/golery/build/release/node_modules

echo "To run as PROD: cd /work/golery/build/release && node server/server.js"
