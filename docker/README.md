# BUILD DOCKER IMAGE
1. Build (if the project was not changed, rebuild is not necessary)
	- ./build-proxy.sh
	- ./build-www.sh
	- ./build-www2.sh
2. ./mep.sh

OR manually as follow:
1. Build:
   ./build-proxy.sh
   ./build-www2.sh
   Those build create releases file in project/build/release folder. 
2. Build www2, create and provision container
   ./create-container.sh
   This create image greensuisse/www:latest then run it.
   Access to url: http://172.17.0.3:3001/www2/#/view/584db3f3640df20011dced4a/5856527b640df20011dced72
3. Push image: ./push-image          
4. Restart task on ECS 
   ./ecs-restart.sh
5. Tag release
   docker tag greensuisse/www:latest greensuisse/wwww:<myversion>
   docker push greensuisse/www:myversion
##Troubleshoot   
1. If fail login to EC2 instance /work/www.credentials/amazon/ssh.sh
   and start container (the container will execute with the exact command with ecs website) 
   docker start <id>  
   docker inspect <id>
2. To investigating running task
   docker exec -it <id> bash
   -  cat /logs/stdout.log
   - /softwares/GS/www/node_modules/forever/bin/forever list


# IMAGE STRUCTURE
1. /softwares/GS/www
	- Old angular code (pencil)
	- Port: 3000
2. /softwares/GS/www2
	- New react
	- Port: 3001
