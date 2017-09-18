#!/usr/bin/env bash
#Copy data from EC2 /data to local git repostiory
#EC2: /data
#LOCAL: /work/www.data/data/
#The local is stored in git lab repository
#WARN ! For first use, on ec2. Run "sudo yum install rsync"
. /work/www.credentials/env.sh
rsync -av -e "ssh $AMAZON_IDENTITY" ec2-user@$AMAZON_HOST:/data/* /work/www.data/data/
