#!/usr/bin/env bash
# DESCRIPTION: This script runs inside container. It provision container

APP=/softwares/golery
WWW=/work/golery
PROVISION=$WWW/docker/provision/files

# create folders
mkdir -p $APP
mkdir -p /logs

# credentials
rsync -rv /work/www.credentials/amazon.ecs.env.sh $APP/

# www app
rsync -rv $WWW/build/release/ $APP/www/
rsync -rv $WWW/build/release/node_modules/ $APP/www/node_modules

# provision files
rsync -rv $PROVISION/ $APP/
