check process sshd with pidfile /var/run/sshd.pid
  group system
  start program "/etc/init.d/sshd start"
  stop program "/etc/init.d/sshd stop"
  if failed host 127.0.0.1 port 3299 protocol ssh then restart
  if 5 restarts within 5 cycles then timeout
