check process turnserver with pidfile /data/apps/var/turnserver/turnserver.pid
        start program "/usr/bin/turnserver -c /etc/turnserver/turnserver.conf -o"  as uid "easemob" and gid "easemob"
        stop program "/bin/sh /data/apps/opt/turnserver/bin/shutdown.sh" as uid "easemob" and gid "easemob"
        if failed host {{ hostname }} port {{ turn_host_listening_port }} type tcp then alert
        if 5 restarts within 5 cycles then timeout
