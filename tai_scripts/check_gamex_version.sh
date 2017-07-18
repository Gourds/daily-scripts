#!/bin/bash
want_gid=$1
shard_list=`cat ${want_gid}_info.txt |sed "s/,//g;s/'//g;s/\[//g;s/\]//g" |awk '{print $1}'`

for each_shard in ${shard_list};do
    shard_info=`ssh -i /home/ec2-user/yakexi07/AWSYingxiong.pem ec2-user@${each_shard}.${want_gid}.gamex.yingxiong.net "cd /opt/;./supervisor/gamex-shard${each_shard}/gamex -v " | grep version |awk '{print $1,$2,$3,$5}'`
    echo "${each_shard}:  $shard_info"
done
