check process cassandra with pidfile /data/apps/var/cassandra/cassandra.pid
  start program "/data/apps/opt/cassandra/bin/cassandra -p /data/apps/var/cassandra/cassandra.pid" as uid "easemob" and gid "easemob" 
  stop program "/data/apps/opt/monit/cassandra.sh stop" as uid "easemob" and gid "easemob"
  if failed host {{ db_host.hostname }} port {{db_host.port}} type tcp then alert
  if 5 restarts within 5 cycles then timeout
