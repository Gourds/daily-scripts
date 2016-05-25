check process tomcat with pidfile /data/apps/var/tomcat/tomcat.pid
  start program "/data/apps/opt/monit/tomcat.sh start" 
  stop program "/data/apps/opt/monit/tomcat.sh stop" 
  if failed host {{usergrid_host.hostname}} port {{usergrid_host.port}} type tcp then restart
  if 5 restarts within 5 cycles then timeout
