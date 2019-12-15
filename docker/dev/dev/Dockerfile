# This docker provide running at local for dev purpose
FROM golery/nodejs
EXPOSE 8080 8443

# Start
#ADD scripts /scripts
ADD ssl-certs-staging /data/app-configs/www/ssl-certs/live/www.golery.com/
WORKDIR /work/golery
RUN pwd
CMD bash

