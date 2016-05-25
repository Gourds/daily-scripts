check process ejabberd with pidfile /data/apps/var/ejabberd/ejabberd.pid
        start program "/data/apps/opt/ejabberd/bin/ejabberdctl start" as uid "easemob" and gid "easemob"
        stop program "/data/apps/opt/ejabberd/bin/ejabberdctl stop" as uid "easemob" and gid "easemob" with timeout 180 seconds 
        if failed host 127.0.0.1 port 5222 type tcp then alert
        if 5 restarts within 5 cycles then timeout
