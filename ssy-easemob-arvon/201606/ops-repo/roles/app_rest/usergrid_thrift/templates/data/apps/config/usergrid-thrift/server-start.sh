#!/bin/bash

export USERGRID_TOOLS_HOME=/data/apps/opt/usergrid-thrift

source /data/apps/config/usergrid/usergrid-env.sh

pushd $USERGRID_TOOLS_HOME
USERGRID_JAVA_OPTS="-server -Xms{{thrift_host.opts.Xms}} -Xmx{{thrift_host.opts.Xmx}}"
USERGRID_JAVA_OPTS="$USERGRID_JAVA_OPTS -XX:MaxGCPauseMillis=500 -XX:GCPauseIntervalMillis=200 -XX:ParallelGCThreads=8"
USERGRID_JAVA_OPTS="$USERGRID_JAVA_OPTS -XX:ConcGCThreads=2 -XX:+UseG1GC -verbose:gc -XX:+PrintGCDetails"
USERGRID_JAVA_OPTS="$USERGRID_JAVA_OPTS -Xloggc:/data/apps/log/usergrid-thrift/tomcat-gc.log -XX:GCPauseIntervalMillis=8000"
USERGRID_JAVA_OPTS="$USERGRID_JAVA_OPTS -Dlogback.configurationFile=/data/apps/config/usergrid/logback-default.xml"
USERGRID_JAR_FILE="usergrid-thrift.jar"
USERGRID_MAIN_CLASS="im.baas.thrift.server.ThriftServerStarter"

exec java $USERGRID_JAVA_OPTS -jar $USERGRID_JAR_FILE $USERGRID_MAIN_CLASS 2>/data/apps/log/usergrid-thrift/usergrid-thrift-error.out 1>/data/apps/log/usergrid-thrift/usergrid-thrift.out &
echo $! > /data/apps/var/usergrid-thrift/usergrid-thrift.pid
popd