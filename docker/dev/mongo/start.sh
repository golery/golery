#!/usr/bin/env bash
#-p 27017:27017
docker run -d --rm -v /work:/work --name=mongo --network=host greensuisse/mongo $1 $2 $3
/work/golery/devtools/db-operating/clone-db-to-local.sh