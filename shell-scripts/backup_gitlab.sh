#!/usr/bin/env sh

RETVAL=0

: ${ConfigBakDir:=/data/backup/gitlab}

function backup_config(){
    [ -d /etc/gitlab ] || exit 4
    [ -d ${ConfigBakDir} ] || mkdir -p ${ConfigBakDir}
    sh -c "cd ${ConfigBakDir} && umask 0077 && tar -cf $(date "+etc-gitlab-%s_%Y_%m_%d.tar") -C / etc/gitlab"
    RETVAL=$?
}

function backup_data(){
    [ -f `which gitlab-rake` ] || exit 5
    gitlab-rake gitlab:backup:create
    RETVAL=$?
}

function restore_data(){
    [ -f `which gitlab-rake` ] && [ -f `which gitlab-ctl` ] || exit 6
    if [[ `gitlab-ctl status unicorn |awk '{print $1}' |sed 's/://'` != 'run' ]] && [[ `gitlab-ctl status sidekiq |awk '{print $1}' |sed 's/://'` != 'run' ]];then
        msg='''Usage: gitlab-rake gitlab:backup:restore BACKUP=1523625192_2018_04_13_10.6.4'''
        echo $msg
    else
        echo 'Please make sure unicorn and sidekiq process have stop ! Now exit'
        exit 7
    fi
}

case $1 in
    bak-etc)
    backup_config
    ;;
    bak-data)
    backup_data
    ;;
    bak)
    backup_config
    backup_data
    ;;
    restore)
    restore_data
    ;;
    *)
    echo $"Usage: $0 {bak|bak-etc|bak-data|restore}"
    RETVAL=2
esac
exit $RETVAL
