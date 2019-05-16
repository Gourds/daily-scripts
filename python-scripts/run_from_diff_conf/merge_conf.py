

import requests
import csv
import os
import shutil
import subprocess
import time


def read_conf_csv(merge_plan_config='merge_plan.csv',backup_dir='./',conf_save_dir='./out_conf'):
    try:
        merge_list = []
        with open(merge_plan_config, 'rb') as f1:
            reader = csv.reader(f1, delimiter=',')
            fieldnames = next(reader)
            reader = csv.DictReader(f1, fieldnames=fieldnames,delimiter=',')
            for row in reader:
                create_conf_file(conf_dict=row,conf_save_dir=conf_save_dir)
                backup_merge_history(row['MergeShards'],backup_dir)
                merge_list.append(row)
        return merge_list
    except IOError,e:
        print 'Please check csv'
    except KeyError,e:
        print 'Please check csv config'

def create_conf_file(conf_dict,conf_save_dir):
    if not os.path.exists(conf_save_dir):
        os.mkdir(conf_save_dir)
    else:
        shutil.rmtree(conf_save_dir)
        os.mkdir(conf_save_dir)
    with open(os.path.join(conf_save_dir,conf_dict['MergeShards']+'.toml'),'w') as f2:
        f2.write('[MergeCfg]' + '\n'*2)
        f2.write('etcd_endpoint = ["http://%s"]' % (etcd_host) + '\n')
        f2.write('etcd_root = "%s"' % etcd_root + '\n')
        f2.write('output_path = "./"' + '\n'*2)
        f2.write('Gid=%s' % etcd_gid + '\n'*2)
        f2.write('SrcShardIdList=[%s]' % conf_dict['MergeShards'].replace('-',',') + '\n' * 2)
        f2.write('ResRedis="%s"' % conf_dict['TredisDB'] + '\n')
        f2.write('ResRedisDB=%s' % conf_dict['TredisNum'] + '\n')
        f2.write('ResRedisDBAuth="%s"' % 'your-db-password' +'\n')
        f2.write('ResRedisRank="%s"' % conf_dict['TrankDB'] + '\n')
        f2.write('ResRedisRankDB=%s' % conf_dict['TrankNum'] + '\n')
        f2.write('ResRedisRankDBAuth="%s"' % 'your-db-password' +'\n')
        f2.write('ResShardId=%s' % conf_dict['MergeShards'].split('-')[0] +'\n')
        f2.write('DelAccountCorpLvl=30' + '\n')
        f2.write('DelAccountNotLoginMin=10080' + '\n')

def run_merge_tools(out_conf_dir,merge_tools_path='./'):
    if not os.path.isfile(os.path.join(merge_tools_path,'/gamex_merge')):
        print "Merge tools is not exist ! Please check your path now"
        exit(7)
    for each_conf in os.listdir(out_conf_dir):
        try:
            print time.asctime( time.localtime(time.time()) )
            out_bytes = subprocess.check_output(['./gamex_merge', 'allinone', '-c', each_conf],stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as e:
            out_bytes = e.output
            code = e.returncode
        print os.path.splitext(each_conf)[0], 'have Done !'
        write_log(os.path.splitext(each_conf)[0] + '.log', out_bytes, merge_tools_path)

def write_log(log_name,log_content, merge_tools_path):
    log_dir = os.path.join(merge_tools_path + 'log/' + time.strftime("%Y-%m-%d", time.localtime()))
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    with open(log_dir + '/%s' % log_name, 'w') as f3:
        f3.write(log_content)
    f3.close()

def backup_merge_history(shards,backup_dir):
    base_gm_url = "http://%s/v2/keys%s/%s/" % (etcd_host, etcd_root, etcd_gid)
    try:
        if not os.path.exists(os.path.join(backup_dir, time.strftime("%Y-%m-%d", time.localtime()))):
            os.makedirs(os.path.join(backup_dir, time.strftime("%Y-%m-%d", time.localtime())))
        with open(os.path.join(backup_dir, time.strftime("%Y-%m-%d", time.localtime()), shards + '.bak'), 'w') as f4:
            for shard_id in shards.split('-'):
                redis_host = requests.get(url=base_gm_url + '%s/gm/redis' % shard_id).json()['node']['value']
                redis_num = requests.get(url=base_gm_url + '%s/gm/redis_db' % shard_id).json()['node']['value']
                rank_host = requests.get(url=base_gm_url + '%s/gm/redis_rank' % shard_id).json()['node']['value']
                rank_num = requests.get(url=base_gm_url + '%s/gm/redis_rank_db' % shard_id).json()['node']['value']
                f4.write("%s,%s,%s,%s,%s" % (shard_id,redis_host,redis_num,rank_host,rank_num) + '\n')
    except KeyError, e:
        print 'Error: Please check etcd config and you request shard!'




if __name__ == '__main__':
    etcd_host = 'etcd.taiqa.net:2379'
    etcd_root = '/taiyouxi'
    etcd_gid = 210
    #
    read_conf_csv(merge_plan_config='merge_plan.csv',backup_dir='./backup_conf',conf_save_dir='./confd')
    #run_merge_tools(out_conf_dir='./confd', merge_tools_path='./')
