#!/usr/bin/env bash

BASE_IMAGE=greensuisse/nodejs
#BASE_IMAGE=greensuisse/www:latest
#If the base image does not exist, use any image with nodejs greensuisse/nodejs
#If we use the www:lastest, the sync of node module will be faster

# Start container in detach mode
CONTAINER=$(docker run -itPd -v /work:/work -w '/softwares/golery/' $BASE_IMAGE bash)
# Run provision script inside docker container
docker exec $CONTAINER /work/golery/docker/provision/provision.sh
docker stop $CONTAINER
echo ">> Created and provision container id= $CONTAINER"
docker commit $CONTAINER golery/www
echo ">> Commit container $CONTAINER to golery/www"
echo "For testing: ./run-image.sh and access http://localhost:80"
echo "Push: ./push-image.sh"
echo "Restart: Launch task with Amazone ECS website"


