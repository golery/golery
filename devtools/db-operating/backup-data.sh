#!/usr/bin/env bash
# This script backup /data/app-data on ec2 instance by commit and push /data/app-data to gitlab repo
# After setup ec2 instance need to setup password git config credential.helper then git pull

EC2_INSTANCE=18.224.97.10
ssh -i "/work/www.credentials/amazon/sshkeypair/id_rsa" ec2-user@$EC2_INSTANCE "cd /data/app-data; git add --all; git commit -m commit; git push"