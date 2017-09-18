#!/usr/bin/env bash
# Backup PROD db to /work/backup-db/$name
# In order to response, first remove all collection (except index), run
# mongorestore -h ds045054.mongolab.com:45054 -d prod -u admin -p admin2015 outputfolder/prod

# db connection
. /work/www.credentials/env.sh

# output folder
folder="/work/www.data/db"
name=$(date +"%Y%m%d.%H%M%S")
out="$folder/$name"
mkdir -p /work/backup-db
echo $name > "$folder/last"

# do backup
echo "Backup to $out"
rm -rf $out
mongodump $MONGO_BACKUP_DB -o $out
