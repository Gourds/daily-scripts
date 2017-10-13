#!/bin/sh

#vars
merge_conf_src='/home/ec2-user/arvon/merge_scripts/merge_conf.txt'
all_shard_conf='/home/ec2-user/arvon/merge_scripts/all_shard_info.txt'
template_merge_conf='/home/ec2-user/arvon/merge_scripts/merge.toml'
gid='202'
redis_auth='mUEiGo1Vy1bZeFhVsPN3VKnV'
dest_dir='/home/ec2-user/arvon/merge_scripts/ready_merge'

#functions
while read C_info;do
    A_shardid=`echo ${C_info} |awk '{print $1}'`
    B_shardid=`expr ${A_shardid} + 1`
    A_info=`cat ${all_shard_conf} | grep ${A_shardid} |sed "s/,//g;s/'//g;s/\[//g;s/\]//g"`
    B_info=`cat ${all_shard_conf} | grep ${B_shardid}|sed "s/,//g;s/'//g;s/\[//g;s/\]//g"`
    A_redis_ip=`echo ${A_info} |awk '{print $2}'`
    B_redis_ip=`echo ${B_info} |awk '{print $2}'`
    C_redis_ip=${A_redis_ip}
    A_redis_db=`echo ${A_info} |awk '{print $3}'`
    B_redis_db=`echo ${B_info} |awk '{print $3}'`
    C_redis_db=`echo ${C_info} |awk '{print $3}'`
    A_redis_rank_db=`echo ${A_info} |awk '{print $5}'`
    B_redis_rank_db=`echo ${B_info} |awk '{print $5}'`
    C_redis_rank_db=`echo ${C_info} |awk '{print $5}'`
    A_merge_rel=`echo ${A_info} |awk '{print $6}'`
    B_merge_rel=`echo ${B_info} |awk '{print $6}'`
#    echo $A_shardid $B_shardid $A_info $B_info
    cp ${template_merge_conf} ${dest_dir}/${A_shardid}_merge.toml
#    echo ${A_redis_ip} ${B_redis_ip} ${C_reids_ip}
#    echo ${A_redis_db} ${B_redis_ip} ${C_redis_ip}
    sed -i "s/^Gid=.*/Gid=${gid}/g;
            s/^ARedis=.*/ARedis=\"${A_redis_ip}\"/g;
            s/^BRedis=.*/BRedis=\"${B_redis_ip}\"/g;
            s/^ResRedis=.*/ResRedis=\"${C_redis_ip}\"/g;
            s/^ARedisDB=.*/ARedisDB=${A_redis_db}/g;
            s/^BRedisDB=.*/BRedisDB=${B_redis_db}/g;
            s/^ResRedisDB=.*/ResRedisDB=${C_redis_db}/g;
            s/^ARedisDBAuth=.*/ARedisDBAuth=\"${redis_auth}\"/g;
            s/^BRedisDBAuth=.*/BRedisDBAuth=\"${redis_auth}\"/g;
            s/^ResRedisDBAuth=.*/ResRedisDBAuth=\"${redis_auth}\"/g;
            s/^ARedisRankDB=.*/ARedisRankDB=${A_redis_rank_db}/g;
            s/^BRedisRankDB=.*/BRedisRankDB=${B_redis_rank_db}/g;
            s/^ResRedisRankDB=.*/ResRedisRankDB=${C_redis_rank_db}/g;
            s/^ARedisRankDBAuth=.*/ARedisRankDBAuth=\"${redis_auth}\"/g;
            s/^BRedisRankDBAuth=.*/BRedisRankDBAuth=\"${redis_auth}\"/g;
            s/^ResRedisRankDBAuth=.*/ResRedisRankDBAuth=\"${redis_auth}\"/g;
            s/^AShardId=.*/AShardId=${A_merge_rel}/g;
            s/^BShardId=.*/BShardId=${B_merge_rel}/g;
            s/^ResShardId=.*/ResShardId=${A_merge_rel}/g;" ${dest_dir}/${A_shardid}_merge.toml
    sudo cp ${dest_dir}/${A_shardid}_merge.toml /opt/supervisor/merge/confd/merge.toml
    read -p "Check merge conf for ${A_shardid},input yes to continue: "  Check_answer </dev/tty
    if [ "${Check_answer}" != "yes" ];then
        echo "Check again !"
        exit 7
    else
        echo "Now the ${A_shardid} and ${B_shardid} is merging..."
        cd /opt/supervisor/merge/
        echo "./gamex_merge  allinone"
        ./gamex_merge  allinone
    fi
done < ${merge_conf_src}
