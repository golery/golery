#!/usr/bin/env bash
#-P: publish all EXPOSED port
#-d: detach

# MAC container run insdie a VM which does not support --network host
# Architecture: webserver => docker => http://host.docker.internal:8100 => goapi
# (Ref. GoApi.js, change the GoApi endpoint)
docker run --rm -d -it -v /work:/work -p 8080:80 --name=dev greensuisse/dev
