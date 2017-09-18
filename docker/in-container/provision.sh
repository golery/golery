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

# wwww
rsync -rv /work/www/package/ /softwares/GS/www
rsync -rv /work/www.node-modules/www/prod/node_modules/ /softwares/GS/www/node_modules

# proxy
rsync -rv /work/www/proxy/build/release/* /softwares/GS/proxy/
rsync -rv /work/www.node-modules/proxy/prod/node_modules/ /softwares/GS/proxy/node_modules

# www2
rsync -rv /work/www/www2/build/release/ /softwares/GS/www2/
rsync -rv /work/www.node-modules/www2/prod/node_modules/ /softwares/GS/www2/node_modules
