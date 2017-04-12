#!/bin/sh
###############################################################################
#Author: arvon
#Email:arvon2014@gmail.com
#Blog: http://blog.arvon.top/
#Date: 2017-04-07
#Filename: rsync_bilogs.sh
#Revision: 1.0
#License: GPL
#Description: crontab job to rsync xxxx
#Notes:
###############################################################################

process_num=`ps axu | grep "rsync -avzP xxxxxx::bilogshome" |wc -l`
#
work_dir=/data/crontab_scripts/xxxx
#create pid
if [ -f ${work_dir}/rsync_bilogs.pid ];then
    if [ ${process_num} -ge 2 ];then
        echo "The scripts is already runing..."
        exit 0
    else
        echo "The process is dead, now clean the pid file and exit"
        cd ${work_dir} && rm -rf rsync_bilogs.pid
        exit 7
    fi
else
    echo $RANDOM > ${work_dir}/rsync_bilogs.pid
    echo "Now is rsync the file..."
    rsync -avzP xxxxx@xxxxx::bilogshome /data/xxxx/ --password-file=/etc/rsync.password && cd ${work_dir} && rm -rf rsync_xxxx.pid
fi
