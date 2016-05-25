#!/bin/bash
cd `dirname $0`

PID=/data/apps/var/easemob-rest/easemob-rest.pid
LOGGING_PATH=/data/apps/log/usergrid/
LOGGING_FILE=${LOGGING_PATH}usergrid.log
LOGGING_ERROR_FILE=${LOGGING_PATH}usergrid.log

SPRING_PROFILES_ACTIVE={{ profile.cluster_name }}
REST_PORT={{profile.port}}
MANAGEMENT_SECURITY_ENABLED=false
JAR=/data/apps/opt/easemob-rest/easemob-rest.jar

USERGRID_JAVA_OPTS="-server -Xms{{Xms}} -Xmx{{Xmx}}  -XX:MaxGCPauseMillis=500 -XX:GCPauseIntervalMillis=200 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=2 -XX:+UseG1GC -verbose:gc -XX:+PrintGCDetails -Xloggc:${LOGGING_PATH}easemob-rest-gc.log.$(date +%Y%m%d-%H%M) -XX:GCPauseIntervalMillis=8000"

exec java $USERGRID_JAVA_OPTS \
	-jar $JAR \
	--spring.profiles.active=${SPRING_PROFILES_ACTIVE} \
	--management.security.enabled=${MANAGEMENT_SECURITY_ENABLED} \
	--server.port=${REST_PORT} \
	--spring.pidfile=${PID} \
	--logging.path=${LOGGING_PATH} \
	--logging.file=${LOGGING_FILE} 2>> ${LOGGING_ERROR_FILE} 1>> ${LOGGING_FILE} &
echo $! > ${PID}

while [ "$(curl http://localhost:{{profile.port}}/status -s -o /dev/null -w '%{http_code}')" != "200" ]
do
    sleep 2
done
while [ "$(curl -s --retry 20 --retry-delay 3 -m 300 -X POST "http://localhost:8081/manage/200" -o /dev/null -w '%{http_code}')" != "200" ]
do
    sleep 2
done

curl -s -X GET "http://localhost:8081/manage/health" >> ${LOGGING_PATH}health.log
