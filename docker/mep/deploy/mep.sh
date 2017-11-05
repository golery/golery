#!/usr/bin/env bash
./build-www.sh
./create-image.sh
./push-image.sh
./ecs-restart.sh
