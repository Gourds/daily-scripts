check process ejabberd with pidfile /data/apps/var/ejabberd/ejabberd.pid
        start program "/data/apps/opt/ejabberd/bin/ejabberdctl start"
        stop program "/data/apps/opt/ejabberd/bin/ejabberdctl stop" with timeout 180 seconds
        if failed host 127.0.0.1 port 5222 type tcp then alert
        if 5 restarts within 5 cycles then timeout
