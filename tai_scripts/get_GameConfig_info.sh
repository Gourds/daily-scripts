#!/bin/sh
###############################################################################
#Author: arvon
#Email: arvon2014@gmail.com
#Blog: http://blog.arvon.top/
#Date: 2017-03-31
#Filename: get_GameConfig_info.sh
#Revision: 1.0
#License: GPL
#Description: get game's server include ip and port etc
#Notes: 
###############################################################################
# Vars
source_etcd_dir=~/Documents/Tai_gitlab/yingxiong-etcd/
source_env_dir=~/Documents/Tai_gitlab/yingxiong-ansible/envs/vpc_yingxiong/
result_dir=/Users/arvon/Documents/Tai_gitlab/arvon-scripts/tai_scripts/
# get etcd config
#printf {printf "%-35s %-35s %-35s %-35s  %-35s %-35s %-35s %-35s %-35\n" "gid","shard_id","listen","redis","redis_auth","redis_db","rank_redis","rank_redis_db","merge_rel"} > ${result_dir}result.txt
echo '"gid"    "shard_id"    "listen"    "redis"    "redis_auth"    "redis_db"    "rank_redis"    "rank_redis_db"    "merge_rel"' > ${result_dir}result.txt
for each_area in `ls ${source_etcd_dir}`;do
    if [ -d "${source_etcd_dir}${each_area}" -a  ${each_area:0:2} == 20 ];then
        for each_region in `ls ${source_etcd_dir}/${each_area}`;do
            if [ -f "${source_etcd_dir}${each_area}/${each_region}" ] && [ ${each_region} -ge 1000 ] 1>err_out.txt 2>&1;then
                cat ${source_etcd_dir}${each_area}/${each_region}|egrep "gid=|^shard_id=|^listen=|^redis=|^redis_db=|^redis_auth=|^rank_redis=|^rank_redis_db=|^merge_rel=" |sed 's/""/"NoInput"/g' |xargs |sed 's/ /=/g' |awk -F'=' '{OSF="\t";print $2,$4,$6,$8,$10,$12,$14,$16,$18}' >> ${result_dir}result.txt
            fi
        done
    fi
done
