check process redis-slave with pidfile /data/apps/var/redis/redis-slave.pid
  group redis
  start program = "/data/apps/opt/redis/bin/redis-server /data/apps/config/redis/redis-slave.conf" as uid "easemob" and gid "easemob"
  stop program = "/data/apps/opt/redis/bin/redis-cli -h 127.0.0.1 -p 6380 shutdown" as uid "easemob" and gid "easemob"
  if failed host {{redis_slave.bind}} port 6380 type tcp then alert
  if 5 restarts within 5 cycles then timeout
