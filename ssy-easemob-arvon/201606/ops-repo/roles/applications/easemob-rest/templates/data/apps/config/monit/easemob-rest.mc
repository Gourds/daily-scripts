check process easemob-rest with pidfile /data/apps/var/easemob-rest/easemob-rest.pid
  start program "/data/apps/config/easemob-rest/server-start.sh"  as uid "easemob" and gid "easemob"
  stop program "/data/apps/config/easemob-rest/server-stop.sh" as uid "easemob" and gid "easemob"
  if failed host {{hostname}} port {{profile.port}} type tcp then alert
  if 5 restarts within 5 cycles then timeout
