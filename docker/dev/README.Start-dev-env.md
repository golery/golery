# INTRODUCTION
This readme explains how to start dev runtime env with dockers

# DEV RUNTIME ENVIRONMENT EXPLANATION
The dev runtime env contains 2 docker container
- "dev" container: dev use docker exec to run expressjs, code watching and auto compile
- "mongo" container

To use DEV RUNTIME ENVIRONMENT, first build it.
As docker image contains sensitive data, it cannot be pushed to public. We just need to build it only one time after cloning
Then start mongo docker and exec 3 process in dev docker as described below

# HOW TO DEV DOCKER IMAGE
Run this step only one time to build and setup docker container.
Note that docker image contains sensitive data, it's not pushed to docker repository
```
cd /work/golery/docker/dev/dev
./build.sh
./create-networks.sh
./run.sh
./attach.sh
Inside container:
cd /work/www
yarn install

```

# HOW TO LAUNCH DEV ENV
In /work/golery/docker/dev
## Start "mongo" container
/work/golery/docker/dev/mongo/start.sh

## Start "dev" container
Start docker container with name "dev" 
```
./run.sh
```


Open 3 console:
```
./run.sh
./dev.client-watch.sh
./dev.server-pm2.sh
./dev.server-watch.sh
```


Access website
http://localhost:8080


# Troubleshoot
./attach.sh to attach to docker
