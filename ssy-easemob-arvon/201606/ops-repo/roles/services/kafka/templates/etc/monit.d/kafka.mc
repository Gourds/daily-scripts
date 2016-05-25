check process kafka with pidfile /data/apps/var/kafka/kafka.pid
  start program "/data/apps/opt/kafka/bin/kafka-server-start.sh -daemon /data/apps/config/kafka/server.properties"  as uid "easemob" and gid "easemob"
  stop program "/data/apps/opt/kafka/bin/kafka-server-stop.sh" as uid "easemob" and gid "easemob"
  if failed host {{kafka_host.hostname}} port {{kafka_host.port}} type tcp then alert
  if 5 restarts within 5 cycles then timeout
