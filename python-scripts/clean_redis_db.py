#!/usr/bin/python
#   sed -i "s/,//g;s/'//g;s/\[//g;s/\]//g;s/:6379//g" all_shard_info.txt
import re
import redis

redis_auth=Waring'xxxx'
old_shard_info='./del_redis_list.txt'
#
all_info = open(old_shard_info,'r')
for each_shard_info in all_info:
#    print each_shard_info
    each_shard_list=each_shard_info.split()
#    print each_shard_list
#    print type(each_shard_list)
    del_shard_num = each_shard_list[0]
    del_redis_host = each_shard_list[1]
    del_redis_db = each_shard_list[2]
    del_rank_host = each_shard_list[3]
    del_rank_db = each_shard_list[4]
    m_redis = redis.StrictRedis(host=del_redis_host,port=6379,password=redis_auth,db=int(del_redis_db))
    print 'Now delete %s redis database %s which in host %s' % (del_shard_num, del_redis_db, del_redis_host)
    m_redis.flushdb()
    r_redis = redis.StrictRedis(host=del_rank_host,port=6379,password=redis_auth,db=int(del_rank_db))
    print 'Now delete %s rank redis database %s which in host %s' % (del_shard_num, del_rank_db, del_rank_host)
    r_redis.flushdb()
all_info.close()
