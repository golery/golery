# This docker provide running at local for dev purpose
FROM greensuisse/nodejs
EXPOSE 8080 8443

# Start
#ADD scripts /scripts
ADD ssl-certs-staging /data/ssl-certs
WORKDIR /work/golery
RUN pwd
CMD bash

