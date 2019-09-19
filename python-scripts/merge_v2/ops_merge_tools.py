import requests
import csv
import os
import shutil
import subprocess
import time
from jinja2 import Environment, FileSystemLoader
import logging
import redis

logging.basicConfig(
    # filename="record.log",
    # filemode="w",
    format="%(asctime)s %(levelname)s: Fun(%(funcName)s %(lineno)d) %(message)s",
    datefmt="%d-%M-%Y %H:%M:%S",
    level=logging.INFO
)
class merge_tools(object):
    def __init__(self):
        self.run_mode = 'do_merge='
        self.etcd_host = '10.0.1.42:2379'
        self.etcd_root = '/SL210'
        self.etcd_gid = '210'
        self.merge_tools_path = './'
        self.merge_conf = 'merge_plan.csv'
        self.password = 'xx'
        self.middle_db_config = {
            'redis': {'host':'10.0.1.42','port':6379, 'pass': None},
            'ardb': {'host': '10.0.1.42', 'port':16379, 'pass':None}
        }

    def get_gm_data(self,shard_id):
        try:
            gm_url = 'http://%s/v2/keys%s/%s/%s/gm/' %(self.etcd_host, self.etcd_root, self.etcd_gid, shard_id)
            rst = {}
            for edata in ['redis','redis_db','redis_rank', 'redis_rank_db']:
                rst[edata] = requests.get(url=gm_url+edata).json()['node']['value']
            return rst
        except KeyError,e:
            logging.error('Etcd error %s!' % e)

    def run(self):
        try:
            with open(self.merge_conf, 'r') as f1:
                f1_csv = csv.reader(f1)
                next(f1_csv)
                if not os.path.exists(os.path.join(self.merge_tools_path + 'confd/')):
                    os.makedirs(os.path.join(self.merge_tools_path + 'confd/'))
                else:
                    shutil.rmtree(os.path.join(self.merge_tools_path + 'confd/'))
                    os.makedirs(os.path.join(self.merge_tools_path + 'confd/'))
                for each_row in f1_csv:
                    if not each_row:
                        continue
                    if len(each_row[-1].split('-')) < 1:
                        raise Exception('no merge shard, Config Err!')
                    conf_data, target_data = ({},{})
                    conf_data['shard_id'] = each_row[0]
                    conf_data['merge_ids'] = each_row[-1].split('-')
                    target_data['redis_rank'] = each_row[1]
                    target_data['redis_rank_db'] = each_row[2]
                    target_data['redis'] = each_row[3]
                    target_data['redis_db'] = each_row[4]
                    logging.debug(conf_data,target_data)
                    self.middle_run(conf_data=conf_data, target_data=target_data)
        except KeyError,e:
             logging.error('Etcd error %s!' % e)

    def middle_run(self,conf_data, target_data):
        if len(conf_data['merge_ids']) == 1:
            source_a = {conf_data['shard_id']: self.get_gm_data(conf_data['shard_id'])}
            source_b = {conf_data['merge_ids'][0]: self.get_gm_data(conf_data['merge_ids'][0])}
            target = {conf_data['shard_id']: target_data}
            self.create_conf_file(source_a,source_b,target,status='D2-N1')
        else:
            for i in range(len(conf_data['merge_ids'])-1):
                target_db = self.look_middle_db()
                if i == 0:
                    source_db_a = self.get_gm_data(conf_data['merge_ids'][i])
                source_db_b = self.get_gm_data(conf_data['merge_ids'][i+1])
                source_a = {conf_data['merge_ids'][0] : source_db_a}
                source_b = {conf_data['merge_ids'][i+1] :source_db_b}
                target = {conf_data['merge_ids'][0]: target_db}
                self.create_conf_file(source_a,source_b,target,status='M%s-N%s' %(str(len(conf_data['merge_ids'])+1),str(i+1)))
                source_db_a = target_db
            source_a = {conf_data['shard_id']: self.get_gm_data(conf_data['shard_id'])}
            mtarget = {conf_data['shard_id']: target_data}
            self.create_conf_file(source_a,target,mtarget,status='D%s-N%s' %(str(len(conf_data['merge_ids'])+1),str(len(conf_data['merge_ids']))))


    def look_middle_db(self,max_db_index=15):
        middle_db = {
            'redis_rank': '%s:%s' % (self.middle_db_config['redis']['host'],str(self.middle_db_config['redis']['port'])),
            'redis': '%s:%s' % (self.middle_db_config['ardb']['host'],str(self.middle_db_config['ardb']['port']))
        }
        logging.debug(self.middle_db_config)
        mid_db = lambda db_type:redis.StrictRedis(host=self.middle_db_config[db_type]['host'],
                          port=self.middle_db_config[db_type]['port'],
                          password=self.middle_db_config[db_type]['pass']
                          )
        for cc in range(max_db_index):
            choice_redis = 'db'+str(cc) not in [k for k in mid_db('redis').info().keys() if str(k).startswith('db')]
            choice_ardb = 'db'+str(cc) not in [k for k in mid_db('ardb').info().keys() if str(k).startswith('db')]
            if choice_redis and choice_ardb:
                middle_db['redis_rank_db'] = cc
                middle_db['redis_db'] = cc
                return middle_db
        raise Exception('No available database')

    def create_conf_file(self, source_a, source_b, target, status=None):
        meta = {
            'etcd_endpoint': self.etcd_host,
            'etcd_root': self.etcd_root,
            'Gid': self.etcd_gid,
            'ARedisDBAuth': self.password,
            'ARedisRankDBAuth': self.password,
            'BRedisDBAuth': self.password,
            'BRedisRankDBAuth': self.password,
            'ResRedisDBAuth': self.password,
            'ResRedisRankDBAuth': self.password
        }
        logging.debug(source_a,source_b,target)
        conf_name = os.path.join(self.merge_tools_path + 'confd/%s_%s_%s.toml' % (status,source_a.keys()[0],source_b.keys()[0]))
        with open(conf_name, 'w') as fp:
            env = Environment(loader=FileSystemLoader('./templates/'))
            template = env.get_template('merge_config.j2')
            content = template.render(source_a=source_a,source_b=source_b,target=target,meta=meta)
            fp.write(content)
        if self.run_mode == 'do_merge':
            logging.info(conf_name)
            self.run_merge_tools(config_file=conf_name)

    def write_log(self, log_name,log_content):
        log_dir = os.path.join(self.merge_tools_path + 'log/' + time.strftime("%Y-%m-%d", time.localtime()))
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        with open(os.path.join(log_dir,log_name), 'w') as f3:
            f3.write(log_content)

    def run_merge_tools(self,config_file):
        if not os.path.exists('./gamex_merge'):
            raise Exception('Could not find gamex_merge tools')
        try:
            logging.debug('./gamex_merge allinone -c %s' % config_file)
            logging.info(os.path.basename(config_file).split('.')[0].replace('_',': ',1))
            out_bytes = subprocess.check_output(['./gamex_merge', 'allinone', '-c', config_file],stderr=subprocess.STDOUT)
            logging.info('Done %s' % config_file)
        except OSError as e:
            logging.error('No merge tools find in the path')
        except subprocess.CalledProcessError as e:
            out_bytes = e.output
            logging.debug(e.returncode)
        if 'out_bytes' in locals().keys():
            self.write_log(os.path.basename(config_file).replace('toml','log'), out_bytes)

if __name__ == '__main__':
    a = merge_tools()
    a.run()
    # print a.look_middle_db()