#!/usr/bin/env bash
docker run -it --rm -p 27017:27017 -v /work:/work --name=mongo --network=dev greensuisse/mongo $1 $2 $3
