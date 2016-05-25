check process msync with pidfile /data/apps/var/msync/msync.pid
        start program "/data/apps/opt/msync/bin/msync start" with timeout 30 seconds
        stop program "/data/apps/opt/msync/bin/msync stop" with timeout 60 seconds
        if failed host 127.0.0.1 port 6717 type tcp then alert
        if 5 restarts within 5 cycles then timeout
