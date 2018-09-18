Create ECS cluster
-----------------
1. Type: EC2 + network.
   This will create an EC2 instance with correct configuration which allows EC2 instance to register automatically to 
   ECS cluster
   
Configure EC2 instance
----------------------
1. Configure DNS with Elastic IP address (don't use Route 53)  
[http://techgenix.com/namecheap-aws-ec2-linux/](http://www.golery.com/undefined)
Update script ./ssh.sh with new IP address
2. Update security group: Allow inbound port 22 (for SSH to EC2 instance), 80, 443

In EC2 instance:
----------------
1. Allow EC2 instance to connect to dockerhub private repository
    1. Generate auth hash:
       SSH to EC2 instance    
       docker login
       This generate ~/.docker/config.json
       with authentication. However, it's used for command line only.
       The ecs agent does not use it.
    2. Add dockerhub authentication to ecs-agent /etc/ecs/ecs.config
       https://docs.aws.amazon.com/AmazonECS/latest/developerguide/private-auth-container-instances.html
       
       - Edit /etc/ecs/ecs.config
       
         ECS_ENGINE_AUTH_TYPE=dockercfg
         ECS_ENGINE_AUTH_DATA={"https://index.docker.io/v1/":{"auth":"<auth>","email":"greensuisse@gmail.com"}}
         ECS_CONTAINER_STOP_TIMEOUT=3s
         with <auth> copy from ~/.docker/config.json
       - Restart ecs agent
         sudo ecs stop && sudo ecs start
         curl http://localhost:51678/v1/metadata
2. Create a data folder
    - sudo mkdir /data 
    - sudo mkdir /data/upload
    - sudo chmod 777 -R /data permisison 777

Create ECS task 
---------------
Task www:
Go to ECS > Task definitions, create task www
    1. Volumes: data => /data
    2. Container: greensuisse/www
       - Port mapping: 443=>8443, 80=>8080
       - Mount: /data => data
    3. Run task
    4. Validate with HTTP: http://ec2-18-211-50-118.compute-1.amazonaws.com/
    5. If there is problem ssh to EC2 instance investigate logs of docker
    

Configure Domain name and HTTPS
-------------------------------
Namecheap, points to new IP. Ensure that http://www.golery.com/ response.
Generate SSL certificate: In docker www on EC2 instance, run /softwares/golery/acme/cron-renew.sh