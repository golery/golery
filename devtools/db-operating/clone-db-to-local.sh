#!/usr/bin/env bash

echo "REMEMBER to delete all collection before running this command"
base="/work/www.data/db/"
backup=$(cat $base/last)
folder="$base/$backup/prod"
echo "Copy from $folder to localhost:27017"
mongorestore -h localhost:27017 -d mean-dev $folder
