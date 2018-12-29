#!/usr/bin/env bash
# This script backup /data/app-data on remote server
# - copy to /data/awsbackup
# - create new branch, commit, push
# WARN ! For first use, on ec2. Run "sudo yum install rsync"

EC2_INSTANCE=18.224.97.10

# COPY FROM AWS
DATE=`date '+%Y%m%d-%H%M%S'`
FOLDER="/data/awsbackup/$DATE"
mkdir -p $FOLDER
rsync -av -e "ssh -i /work/www.credentials/amazon/sshkeypair/id_rsa" ec2-user@$EC2_INSTANCE:/data/app-data $FOLDER
cd $FOLDER/app-data

# Create branch, commit and push
BRANCH="backup-$DATE"
git checkout -b $BRANCH
git add --all && git commit -m "$BRANCH"
git push --set-upstream origin $BRANCH

echo Backup to $FOLDER, git commit and push to branch $BRANCH
