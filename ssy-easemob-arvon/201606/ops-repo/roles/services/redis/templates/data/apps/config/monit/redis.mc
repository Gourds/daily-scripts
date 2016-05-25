check process redis with pidfile /data/apps/var/redis/redis.pid
  group redis
  start program = "/data/apps/opt/redis/bin/redis-server /data/apps/config/redis/redis.conf" as uid "easemob" and gid "easemob"
  stop program = "/data/apps/opt/redis/bin/redis-cli -h 127.0.0.1 shutdown" as uid "easemob" and gid "easemob"
  if failed host {{redis_master.bind}} port 6379 type tcp then alert
  if 5 restarts within 5 cycles then timeout
