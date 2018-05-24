#DOCKER DEV
Docker Dev provides an environment for building and running project

#HOW TO START ?
##Build
```
./build.sh
./create-networks.sh
./run.sh
./attach.sh
Inside container:
cd /work/www
yarn install
```

Note:
- The docker image is not pushed to repository. Thus you have to build it by yourself.

## Start mongo
cd mongo && ./start

##Run
./run.sh

Open 3 console:
- 1st console:
```
./attach.sh
yarn run client.watch
```

- 2nd console:
```
./attach.sh
yarn run server.watch
```

- 3rd console:
```
./attach.sh
yarn run server.pm2
```

Access website
http://localhost:8080



