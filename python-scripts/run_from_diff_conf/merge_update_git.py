#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import re
import os
import yaml

git_etcd_dir = '/Users/arvon/Documents/Tai_gitlab/yingzhuo-jenkins-etcd-deploy/etcd-205/205/'
git_fact_dir = '/Users/arvon/Documents/Tai_gitlab/yingzhuo-jenkins-etcd-deploy/ansible-start-205/envs/vpc_yingzhuo/205/gamex/'
#Tips: find ./yingzhuo-jenkins-etcd-deploy/etcd-205/205/ -type f | egrep "[0-9]{4}" |xargs grep -A2 10.31.2.10 |egrep redis_db=


def update_etcd(shard_idA,shard_idB,Res_redis_host,Res_redis_num,Res_rank_host,Res_rank_num):
    shard_fileA = git_etcd_dir + '%s' % shard_idA
    shard_fileB = git_etcd_dir + '%s' % shard_idB
    fa = open(shard_fileA, 'r')
    fa_content = fa.read()
    merge_fa = re.search('merge_rel=.*',fa_content).group().split('=')[1]
    if os.path.isfile(shard_fileB):
        with open(shard_fileB,'r') as fb:
            merge_fb =  re.search('merge_rel=.*',fb.read()).group().split('=')[1]
        merge_ab = str(merge_fa) + ',' + str(merge_fb)
        fa.seek(0, os.SEEK_SET)
        new_data = ''
        for each_line in fa.readlines():
            if 'merge_rel=' in each_line:
                each_line = re.sub('merge_rel=.*', 'merge_rel=%s' % merge_ab, each_line)
            elif re.match('redis=.*', each_line):
                each_line = re.sub('redis=.*', 'redis=%s' % Res_redis_host, each_line)
            elif re.match('redis_db=.*', each_line):
                each_line = re.sub('redis_db=\d+', 'redis_db=%s' % Res_redis_num, each_line)
            elif re.search('rank_redis=', each_line):
                each_line = re.sub('rank_redis=.*', 'rank_redis=%s' % Res_rank_host, each_line)
            elif re.search('rank_redis_db=', each_line):
                each_line = re.sub('rank_redis_db=.*', 'rank_redis_db=%s' % Res_rank_num, each_line)
            new_data += each_line
        fa.close()
        with open(shard_fileA, 'w') as fe:
            fe.write(new_data)
    else:
        print 'The file %s not exist, Please check' % shard_fileB

def delete_etcd(shard_id):
    if os.path.isfile(git_etcd_dir + shard_id):
        print 'delete %s' % shard_id
        os.remove(git_etcd_dir + shard_id)
    else:
        print 'The file %s may be have been delete' % (git_etcd_dir + shard_id)

def delete_fact(shard_id_list):
    for each_file in os.listdir(git_fact_dir):
        fact_file = git_fact_dir + each_file
        try:
            with open(fact_file, 'r') as f:
                content = yaml.load(f)
                # print content['dev_gamex_conf']
                for each_shard in shard_id_list:
                    if each_shard in content['dev_gamex_conf']:
                        del content['dev_gamex_conf'][each_shard]
            # print yaml.dump(content)
            with open(fact_file, 'w') as f2:
                f2.write(yaml.dump(content))
        except IOError:
            return

if __name__ == '__main__':
    with open('merge_plan.csv', 'rb') as f1:
        f1_csv = csv.reader(f1)
        title = next(f1_csv)
        del_shard=[]
        for each_row in f1_csv:
            del_shard.append(each_row[1])
            update_etcd(each_row[0],each_row[1],each_row[3],each_row[4],each_row[5],each_row[6])
            delete_etcd(each_row[1])
        delete_fact(del_shard)
