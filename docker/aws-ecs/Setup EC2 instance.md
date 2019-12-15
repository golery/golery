What is free?
-------------
https://aws.amazon.com/free/
Read the end of page.
- Ec2 instance type: t2.micro (1G memory)
- ECR (docker repository): 500MB/month - Don't use it

What is not free?
- Route 53
- Unbound Elastic IP address
- Secret manager (not quite sure) for loading automatically the docker image

Basic architecture 
------------------
A cluster with 1 *EC2 instance*. 
This instance is created with special image and register with cluster. It's called *ECS Instances*.
EC2 instance has agent docker which can load and run other dockers
   

Create ECS cluster
-----------------
WARN ! Do not create EC2 instance by yourself. By creating ECS cluster, a new EC2 instance is launched.

1. Start with ECS service. 
   Create cluster with type "Choose EC2 linux + networking"
   Cluster name: default
   Ec2 instance type: t2.micro
   Important: Load public key (You cannot do that later)
   Choose existing VPC (virtual private cloud)
   
   This create a cluster with 1 EC2 instance + SSH key pair for access 
  
Create new Task definition 
--------------------------
Go to ECS > Task definitions.
1. Type: EC2 (not Fargate)
2. Task name: www
3. Network mode: bridge
4. Role: create role (https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html)
   Choose: Trusted Entity : AWS, Service: Elastic Container Service > Elastic Container Service Task
   Choose role: AmazonECSTaskExecutionRolePolicy. Allow task to auth with Amazon ECS service on Golery behalf
   If created correctly, the role is visible for selecting
5. Task size: Don't need to specify as we are no using Fargate
5. Create Container: 
   - Name: www (whatever)
   - Image: golery/www
   - Private repository authentication: No. Secret manager is not free.
   - Port mapping: 443=>8443, 80=>8080
   - CPU unit: 512 (ie. Half of 1 CPU core)
   - Memory limit: Hard limit: 300MB  (t2.micro memory = 1G)
   - Entry point: none
   - Command: ./start-server.sh
   - Mount: /data => data
6. Run task
   - There is error: Cannot pull container error    
  
Setup EC2 instance from browser
-------------------------------
1. Cluster > ECS instance
   This is a list of EC2 instance which is registered to cluster.
   For free tier, there is only one instance. Open it.
2. Menu security group. 
   Add inbound SSH, HTTP, HTTPS
3. Menu Elastic IP:
   Allocate new.Associate with instance.
   Action > Associate Elastic IP address
   Note:
   - Don't use Route 53. It's not free
   - Must associate the elastic IP to instance right away. If you drop EC2 instance, delete the elastic IP.  
   [http://techgenix.com/namecheap-aws-ec2-linux/](http://www.golery.com/undefined)
   - Update script /work/www.credential/amazon/ssh.sh with new IP address and use new private key
   

Setup EC2 instance by ssh to instance
--------------------------------------
1. Connect to EC2 instance and update
   /work/www.credential/amazon/ssh.sh
   sudo yum install nano git  (Yum is package manager by redhat)
2. Allow EC2 instance to connect to dockerhub private repository
    1. Generate auth hash:
       docker login
       This generate ~/.docker/config.json
       with authentication. However, it's used for command line only.
       The ecs agent does not use it.
    2. Add dockerhub authentication to ecs-agent /etc/ecs/ecs.config
       https://docs.aws.amazon.com/AmazonECS/latest/developerguide/private-auth-container-instances.html
       - sudo nano /etc/ecs/ecs.config
       
         ECS_ENGINE_AUTH_TYPE=dockercfg
         ECS_ENGINE_AUTH_DATA={"https://index.docker.io/v1/":{"auth":"<auth>","email":"greensuisse@gmail.com"}}
         ECS_CONTAINER_STOP_TIMEOUT=3s
         with <auth> copy from ~/.docker/config.json
       - Restart ecs agent
         sudo stop ecs 
         sudo start ecs
         curl http://localhost:51678/v1/metadata
2. Create a data folder for www.
   These folder are not used by goapi and not stored in github.
    - sudo mkdir /data 
    - sudo mkdir /data/upload
    - sudo mkdir /data/ssl-certs
    - sudo chmod 777 -R /data 

Generate SSL ceritificate
-------------------------
Generate SSL certificate: 
In docker www on EC2 instance, run /softwares/golery/acme/cron-renew.sh
Check that there is files in /data/ssl-certs

Configure Domain name and HTTPS
-------------------------------
Namecheap
Choose Advanced DNS.
Points to new IP from EC2 instance > Public IP v4
Ensure that http://www.golery.com/ response.


Monitoring
----------
Setup Billing budget monitor: 10$ with 0.1, 0.5, 1$ amount alert

Shutdown 
--------
1. Check there is budget monitoring
2. Delete elastic IP. Delete Ec2 instance. Delete Ecs cluster
3. Make payment
4. Close account

Setup GOAPI
-----------
See Readme.md in goapi repo