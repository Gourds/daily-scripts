#!/bin/bash
cd `dirname $0`

PID=/data/apps/var/usergrid/easemob-{{ profile.service_name }}.pid
LOGGING_PATH=/data/apps/log/usergrid/
LOGGING_FILE=${LOGGING_PATH}easemob-{{ profile.service_name }}.log
LOGGING_ERROR_FILE=${LOGGING_PATH}easemob-{{ profile.service_name }}-error.log

SPRING_PROFILES_ACTIVE={{ profile.cluster_name }}
MANAGEMENT_SECURITY_ENABLED=false

USERGRID_JAVA_OPTS="-server -Xms{{Xms}} -Xmx{{Xmx}}  -XX:MaxGCPauseMillis=500 -XX:GCPauseIntervalMillis=8000 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=2 -XX:+UseG1GC -verbose:gc -XX:+PrintGCDetails -Xloggc:${LOGGING_PATH}easemob-thrift-gc.log -Dfile.encoding=utf-8 -Duser.language={{locale_lang}} -Duser.region={{locale_region}}"

exec java ${USERGRID_JAVA_OPTS} -jar /data/apps/opt/easemob-{{ profile.service_name }}/{{ profile.package_name }}-{{ profile.package_version }}.jar \
	--spring.profiles.active=${SPRING_PROFILES_ACTIVE} \
	--management.security.enabled=${MANAGEMENT_SECURITY_ENABLED} \
	--spring.pidfile=${PID} \
	--logging.path=${LOGGING_PATH} \
	--logging.file=${LOGGING_FILE} 2> ${LOGGING_ERROR_FILE} 1> ${LOGGING_FILE} &
echo $! > ${PID}
