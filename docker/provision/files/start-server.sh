#!/usr/bin/env bash
#Start the server and run it for ever. If it crashes (after 5sec) then it will restarted automatically
source /softwares/golery/amazon.ecs.env.sh
export NODE_ENV=production
# delete all logs
pm2 flush

cd /softwares/golery/www
pm2 start --name 'www' server/server.js

#cd /softwares/golery/proxy
#pm2 start --name 'proxy' server/server.js

pm2 logs | tee /data/www.log
