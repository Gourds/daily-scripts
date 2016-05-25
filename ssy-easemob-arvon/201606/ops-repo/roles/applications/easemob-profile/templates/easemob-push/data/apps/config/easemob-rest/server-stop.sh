#!/bin/sh
PID=/data/apps/var/easemob-rest/easemob-rest.pid

kill -9 `ps aux|grep ' -jar /data/apps/opt/easemob-rest/easemob-rest.jar ' | grep -v grep | awk '{print $2}'` && rm ${PID}
