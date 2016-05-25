check process conference with pidfile /data/apps/var/conference/conference.pid
        start program "/bin/sh /data/apps/opt/conference/server-start.sh" as uid "easemob" and gid "easemob"
        stop program "/bin/sh /data/apps/opt/conference/server-stop.sh" with timeout 180 seconds
        if failed host {{ conference_host_hostname }} port {{ conference_host_port }} type tcp then alert
        if 5 restarts within 5 cycles then timeout
