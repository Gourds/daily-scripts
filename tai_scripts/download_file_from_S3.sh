#!/bin/sh
###############################################################################
#Author: arvon
#Email:arvon2014@gmail.com
#Blog: http://blog.arvon.top/
#Date: 2017-04-06
#Filename: download_file_from_S3.sh
#Revision: 1.0
#License: GPL
#Description: download bilogs from haiwai S3 to local
#Notes:
###############################################################################
#vars
time_yesterday=`date +%F -d "-1 days"`
dir_dest="/data/xxxx/"
if [ $# = 0 ];then
    time_want=${time_yesterday}
elif [ $# = 1 ];then
    if echo $1 |egrep -q "^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$";then
        time_want=$1
    else
        echo "Please Use like: $0 2017-01-01"
    fi
else
    exit 7
fi
mkdir -pv ${dir_dest}tmp
mkdir -pv ${dir_dest}userinfo_guildinfo_zip
chown -R jenkins.jenkins ${dir_dest}
#functions
function Main(){
aws_down_bilogs
zip_bilogs_local
}
#functions
function aws_down_bilogs(){
echo "aws  --region xxxx  cp s3://xxxx/${time_want}/   ${dir_dest}   --recursive"
aws  --region xxxxx s3  cp s3://xxx/xxx/${time_want}/   ${dir_dest}   --recursive
}
function zip_bilogs_local(){
#yum install zip unzip -y
cd ${dir_dest}
zip -r userinfo_guildinfo_${time_want}.zip  *${time_want}.csv && mv *.csv ${dir_dest}tmp && rm -rf ${dir_dest}tmp/*.csv
mv userinfo_guildinfo_${time_want}.zip ${dir_dest}userinfo_guildinfo_zip/
}
Main
