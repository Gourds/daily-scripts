check process media with pidfile /data/apps/var/mediaserver/mserver.pid
        start program "/usr/bin/sh /data/apps/opt/mediaserver/mediaserver_start.sh" as uid "easemob" and gid "easemob"
        stop program "/usr/bin/sh /data/apps/opt/mediaserver/mediaserver_stop.sh" with timeout 180 seconds
        if failed host {{ media_host_hostname }} port {{ media_host_server_port }} type tcp then alert
        if 5 restarts within 5 cycles then timeout
