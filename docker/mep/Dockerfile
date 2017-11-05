FROM greensuisse/dev
RUN apt-get update
# install docker
RUN apt-get install docker.io -y

# install aws
WORKDIR /softwares
RUN apt-get install python unzip -y
RUN curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
RUN unzip awscli-bundle.zip
RUN ./awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

#install json parser for mep.sh script
RUN apt-get install jq -y

WORKDIR /work/www/docker/mep/deploy
CMD ./mep.sh