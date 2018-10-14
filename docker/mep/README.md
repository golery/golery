This image builds and deploys www module to amazon ECS

#To build and deploy
(Just one time) ./build-image.sh
(Just one time on host machine) sudo docker login
./run-image.sh

#To investigate build issue
./build-image.sh
./run-image.sh bash
Inside container, run step by steps command in mep.sh

#To PROD www container at local
docker run -it --rm -p 8080:8080 greensuisse/www ./start-server.sh
Access http://localhost:8080 