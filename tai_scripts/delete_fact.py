#!/usr/bin/python
# -*- coding:utf-8 -*-
###############################################################################
#Author: arvon
#Email: guoyafeng@taiyouxi.cn
#Blog: http://blog.arvon.top/
#Date: 2017/05/16
#Filename: delete_assign_facts.py
#Revision: 1.0
#License: GPL
#Description: delete useless facts from dev_gamex.fact
#Notes: usage liki,python delete_assign_facts.py 3001
###############################################################################

import json
import sys

del_shard = int(sys.argv[1])
fact_path = '/etc/ansible/facts.d/dev_gamex.fact'
with open(fact_path) as f:
    m_data = json.load(f)
    info_dict = m_data["shardsinfo"]
    shards_list = m_data["shards"]
    if del_shard in shards_list:
        shards_list.remove(del_shard)
        info_dict.pop(str(del_shard))
        f.close()
        with open(fact_path, 'w+') as nf:
            nowfact = json.dumps(m_data, sort_keys=True, indent=1)
            nf.write(nowfact)
            print 'Now the %(del_shard)s have bean deleted !' % dict(del_shard=str(del_shard))
            nf.close()
    else:
        print 'There is no such shardid named %(del_shard)s !' % dict(del_shard=str(del_shard))
