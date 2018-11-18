This docker mount credentials from host machine.
To change credention:
./run.sh
In container:
- Create new user IAM 
- Create new access key. You will have access key
- Run aws configure
  Choose regions 
  This will output files to /root/.aws which is written to host at /work/www.credentials/amazon/aws-cli/_aws
  This configure is also used for MEP docker
