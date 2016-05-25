#/bin/sh
ps ax | grep -i 'turnserver.conf' | grep -v grep | awk '{print $1}' | xargs kill -9
rm -rf /data/apps/var/turnserver/turnserver.pid
