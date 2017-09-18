#!/usr/bin/env bash
BASE_IMAGE=greensuisse/www:latest
#stop all current process at local to avoid port conflict
pm2 delete all
echo Start container. Access at http://localhost:80 (or access directly to proxy http://localhost:8080,3000,3001)
docker run -itP -p 80:8080 -p 3000:3000 -p 3001:3001 -v /work:/work -w '/softwares/GS/www' $BASE_IMAGE bash
