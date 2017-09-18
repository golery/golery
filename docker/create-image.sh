#!/usr/bin/env bash

BASE_IMAGE=greensuisse/nodejs
#BASE_IMAGE=greensuisse/www:latest
#If the base image does not exist, use any image with nodejs greensuisse/nodejs
#If we use the www:lastest, the sync of node module will be faster

# Start container in detach mode
DOCKER=$(docker run -itPd -v /work:/work -w '/softwares/GS/' $BASE_IMAGE bash)
# Run provision script inside docker container
docker exec $DOCKER /work/www/docker/in-container/provision.sh
docker stop $DOCKER
echo ">> Created and provision container id= $DOCKER"
docker commit $DOCKER greensuisse/www
echo ">> Commit container $DOCKER to greensuisse/www"
echo "For testing: ./run-image.sh and access http://localhost:80"
echo "Push: ./push-image.sh"
echo "Restart: Launch task with Amazone ECS website"


