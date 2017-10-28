#!/usr/bin/env bash
cd /softwares/golery/acme
. acme.sh.env
./acme.sh -d www.golery.com --issue -w /softwares/golery/www/server/Static --days 60 --renew-hook 'pm2 restart www' --staging
echo RUN IN STAGING MODE
mkdir -p /data/ssl-certs
./acme.sh -d www.golery.com --installcert --key-file /data/ssl-certs/key.pem --fullchain-file /data/ssl-certs/fullchain.cert.pem
