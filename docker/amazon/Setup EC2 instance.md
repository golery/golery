1. Create Amazon account
2. Setup
    1. Create NetworkSecurity group  
By default, EC2 accept inbound connection only from PVC network only. and allow all outbound network.  
Thus we cannot ssh.  

        1. Add Inbound http, https, ssh from all IP (0.0.0.0)

    2. Create role  ecsInstanceRole  
[http://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html](http://www.golery.com/undefined) (Section To create the ecsInstanceRole IAM role for your container instances)  

3. Launch EC2 instance  
Guideline can be found at: [http://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_container_instance.html](http://www.golery.com/undefined)
    1. Choose one of instance in this list   
[http://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html](http://www.golery.com/undefined)  
(Ex choose instance in region  eu-central-1)
    2. Choose instance type t2.micro, 1CPU, 1GB.  
This instance is eligible for free tier.  

    3. Step3:  Configure Instance Details   
IAM role: choose ecsInstanceRole 
    4. Step4: Add storage  
Nothing can be changed for free tier.   
1st storage: 8G 2nd storage: for storing docker. It already 30GB, and amazon does not allow to create instance if we reduce the size
    5. Step5: Add tags  
Do nothing
    6. Step6: Configure security group  
Choose existing group. There is only one which which allows all network traffic
    7. Final: Create a new keypair. Download and keep the .pem file.  
It's private key for ssh to EC2 instance  

    8. EC2 will be launched. If all are good, you will have  
![Image](https://i.imgur.com/zp3VrHG.jpg)  
Click on link i-0fff.. to check status of instance  

4. Create new task www with data folder
    1. Create volume name=data, folder: /data on EC2 instance
    2. In task, map container /data to host /data folder  

5. Configure connection to docker hub
    1. Ref. http://docs.aws.amazon.com/AmazonECS/latest/developerguide/private-auth.html 
    2. Generate auth hash:
       SSH to EC2 instance    
       docker login
       This generate ~/.docker/config.json
       with authentication. However, it's used for command line only.
       The ecs agent does not use it.
    2. Configure ecs-agent /etc/ecs/ecs.config
       Edit /etc/ecs/ecs.config
       ECS_ENGINE_AUTH_TYPE=dockercfg
       ECS_ENGINE_AUTH_DATA={"https://index.docker.io/v1/":{"auth":"...from config.json....","email":"greensuisse@gmail.com"}}
       ECS_CONTAINER_STOP_TIMEOUT=3s
6. Configure DNS with Elastic IP address (don't use Route 53)  
[http://techgenix.com/namecheap-aws-ec2-linux/](http://www.golery.com/undefined)
7. Create a folder /data/upload with permisison 777 in EC2 instance (not in container).
8. AWS CLI
    1. Create an user with admin policy permission in IAM
    2. aws configure