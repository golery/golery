#!/usr/bin/env bash
#-P: publish all EXPOSED port
#-d: detach
docker rm $(docker ps -aq -f "name=dev")
docker run -d -it -v /work:/work --network=host --name=dev greensuisse/dev
