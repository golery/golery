#!/usr/bin/env bash
#This requires install awscli and apt-get install jq
TASKID=$(aws ecs list-tasks --family www| jq -r '.taskArns[0]')
echo TASK: $TASKID
if [ $TASKID != null ]
then echo "STOP task"
    aws ecs stop-task --task $TASKID
    echo WAIT FOR TASK TO STOP: $TASKID
    aws ecs wait tasks-stopped --tasks $TASKID
fi

echo "START TASK";
aws ecs run-task --task-definition www
TASKID=$(aws ecs list-tasks | jq -r '.taskArns[0]')
echo WAIT FOR RUNNING TASK: $TASKID
aws ecs wait tasks-running --tasks $TASKID

