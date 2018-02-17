#!/usr/bin/env bash
#-P: publish all EXPOSED port
#-d: detach
docker rm $(docker ps -aq -f "name=dev")
docker run -d -it -v /work:/work -p 8080:8080 -p 8443:8443 --network=dev --name=dev greensuisse/dev
