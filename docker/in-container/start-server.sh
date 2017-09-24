#!/usr/bin/env bash
#Start the server and run it for ever. If it crashes (after 5sec) then it will restarted automatically
#https://github.com/foreverjs/forever
#-m  MAX          Only run the specified script MAX times
#-l  LOGFILE      Logs the forever output to LOGFILE
#-o  OUTFILE      Logs stdout from child script to OUTFILE
#-e  ERRFILE      Logs stderr from child script to ERRFILE
#--minUptime      Minimum uptime (millis) for a script to not be considered "spinning" (ie. Fail to start)
#--spinSleepTime  Time to wait (millis) between launches of a spinning script.
source /softwares/GS/amazon.ecs.env.sh
export NODE_ENV=production
# delete all logs
pm2 flush

cd /softwares/GS/www
pm2 start --name 'www' server/server.js

cd /softwares/GS/proxy
pm2 start --name 'proxy' server/server.js

pm2 logs
