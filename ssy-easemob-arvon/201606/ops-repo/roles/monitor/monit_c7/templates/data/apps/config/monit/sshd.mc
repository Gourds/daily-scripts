check process sshd with pidfile /run/sshd.pid
  group system
  start program "/usr/bin/systemctl start sshd.service"
  stop program "/usr/bin/systemctl stop sshd.service"
  if failed host 127.0.0.1 port 22 protocol ssh then restart
  if 5 restarts within 5 cycles then timeout
