#!/bin/bash
dir=~/Documents/Tai_gitlab/yingxiong-etcd/
result_dir=/Users/arvon/arvon-scripts/
for i in `ls $dir |grep 0`;do
#    echo $i
    cd ${dir}${i}
    for o in `ls |grep -E '1|2|3'`;do
        cat ${dir}${i}/${o} |grep -E 'gid=|shard_id=|rank_redis=|rank_redis_db=|rank_redis_auth' |sed 's#""#"Null"#g' |xargs |sed 's/ /=/g' |awk -F'=' '{print $2,$4,$6,$10,$8}' |sed 's/ /,/g' >> ${result_dir}/result.txt
    done
    cd
done


