#!/bin/bash
LOGPATH=/opt/ejabberd/var/log/ejabberd
ERROR_LOG=$LOGPATH/error.log*
CRASH_LOG=$LOGPATH/crash.log*
BACKUP=`date +%Y%m%d%H%M`
EMAIL="eric@easemob.com,jma@easemob.com,douzl0814@163.com,stliu@easemob.com,dengchao@easemob.com,liulantao@easemob.com"
HOSTNAME=`hostname`
SUBJECT="Ejabberd LOG Checking on $HOSTNAME"

SENT=0

ls $LOGPATH/ | grep error.log >> /dev/null
RETURN=$?

if [ $RETURN == 0 ]
then
    MESSAGE="Error log in path $LOGPATH/$BACKUP on $HOSTNAME, please check!"
    mkdir -p $LOGPATH/$BACKUP
    mv $ERROR_LOG $LOGPATH/$BACKUP
    SENT=1
fi

ls $LOGPATH/ | grep crash.log >> /dev/null 
RETURN=$?

if [ $RETURN == 0 ]
then
    MESSAGE="Error log in path $LOGPATH/$BACKUP on $HOSTNAME, please check!"
    mkdir -p $LOGPATH/$BACKUP
    mv $CRASH_LOG $LOGPATH/$BACKUP
    SENT=1
fi

if [ -d $LOGPATH/$BACKUP ]
then
   echo "in dir"
   cd $LOGPATH/$BACKUP
   grep "mod_message_log:loop:118" error.log >> /dev/null
   SENT=$?
fi

CRITICAL=1
echo $CRITICAL

if [ -d $LOGPATH/$BACKUP ]
then
   cd $LOGPATH/$BACKUP
   grep "inconsistent_database" * 
   CRITICAL=$?
fi

echo $LOGPATH/$BACKUP $CRITICAL


criticalmark()
{
    BODYFILE=/tmp/body.txt
    >$BODYFILE
    if [ $CRITICAL == 0 ]
    then
       SUBJECT="Mnesia event on $HOSTNAME"
    fi
}

mailsend()
{
   criticalmark
   if [ $SENT == 1 ]
   then
       cd $LOGPATH/$BACKUP
       for i in `ls`
       do
           echo "---The log file $LOGPATH/$BACKUP/$i---" >> $BODYFILE
           cat $i >> $BODYFILE
           echo "---The end of log file---" >> $BODYFILE
           echo " " >> $BODYFILE
       done
       cat $BODYFILE | mutt $EMAIL -s "$SUBJECT"
       echo "mail was sent"
   fi
}

mailsend
