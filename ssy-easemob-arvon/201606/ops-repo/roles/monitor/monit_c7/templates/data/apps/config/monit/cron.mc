check process cron with pidfile /run/crond.pid
  group system
  start program = "/usr/bin/systemctl start crond.service"
  stop  program = "/usr/bin/systemctl stop crond.service"
  if 5 restarts within 5 cycles then timeout
