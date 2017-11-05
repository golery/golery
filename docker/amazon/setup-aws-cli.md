#INSTALL AWS-CLI
http://docs.aws.amazon.com/cli/latest/userguide/awscli-install-linux.html
1. apt-get install python
2. apt-get install python-pip
3. pip install awscli --upgrade --user
4. Test: aws --version
   export PATH=~/.local/bin:$PATH
5. Run aws configure
   - Input access-key-id and secret-acces-key of user admin in   
   /work/www.credentials/amazon/iam/admin
   - Region eu-central-1
6. Test aws ecs list-tasks
    More commands: aws ecs help