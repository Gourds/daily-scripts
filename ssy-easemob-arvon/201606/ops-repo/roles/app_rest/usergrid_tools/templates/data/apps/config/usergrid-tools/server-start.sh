#!/bin/bash

export USERGRID_TOOLS_HOME=/data/apps/opt/usergrid-tools

source /data/apps/config/usergrid/usergrid-env.sh

pushd $USERGRID_TOOLS_HOME
exec java -server -Xms{{tools_host.opts.Xms}} -Xmx{{tools_host.opts.Xmx}} -XX:MaxGCPauseMillis=500 -XX:GCPauseIntervalMillis=200 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=2 -XX:+UseG1GC -verbose:gc -XX:+PrintGCDetails -Xloggc:/data/apps/log/usergrid-tools/tomcat-gc.log -XX:GCPauseIntervalMillis=8000 -Dlogback.configurationFile=/data/apps/config/usergrid/logback-default.xml -jar usergrid-tools.jar BatchWorker -topics ejabberd:chat:messages usergrid:apns:todo ejabberd:chat:offlines -enable_logger true -enable_scheduler true &
echo $! > /data/apps/var/usergrid-tools/usergrid-tools.pid
popd