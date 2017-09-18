#!/usr/bin/env bash
# DESCRIPTION: This script runs inside container. It provision container
# - Copy www build files to folder /software/GS
# - Create logs folder
# - Copy node_modules
# Copy source and node_modules to /softwares/GS/www
mkdir -p /softwares/GS
mkdir -p /logs
rsync -rv /work/www/docker/in-container/start-server.sh /softwares/GS/
rsync -rv /work/www.credentials/amazon.ecs.env.sh /softwares/GS/

# proxy
rsync -rv /work/www/proxy/build/release/* /softwares/GS/proxy/
rsync -rv /work/www.node-modules/proxy/prod/node_modules/ /softwares/GS/proxy/node_modules

# www
rsync -rv /work/www/build/release/ /softwares/GS/www/
rsync -rv /work/www/build/release/node_modules/ /softwares/GS/www/node_modules
