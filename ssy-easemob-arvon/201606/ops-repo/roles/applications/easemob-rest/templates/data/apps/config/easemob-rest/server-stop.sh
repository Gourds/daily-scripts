#!/bin/sh
PID=/data/apps/var/easemob-rest/easemob-rest.pid

status=`curl -s --connect-timeout 5 --max-time 60 --retry 5 -X POST "http://localhost:8081/manage/503"`
echo $status
sleep 10

kill -9 `ps aux|grep ' -jar /data/apps/opt/easemob-rest/easemob-rest.jar ' | grep -v grep | awk '{print $2}'` && rm ${PID}
