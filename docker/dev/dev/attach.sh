#!/usr/bin/env bash
CONTAINER_ID=$(docker ps -qf "ancestor=greensuisse/dev")
echo Container $CONTAINER_ID
docker exec -it  $CONTAINER_ID bash
