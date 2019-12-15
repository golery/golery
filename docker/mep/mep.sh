#!/usr/bin/env bash
#Run ./run.sh to mep automatically
#Run ./run.sh bash to run bash

docker run -it --rm \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /work:/work \
    -v "/home/$USER/.docker:/root/.docker" \
    -v '/work/www.credentials/amazon/aws-cli/_aws:/root/.aws' \
    golery/mep $1 $2 $3
