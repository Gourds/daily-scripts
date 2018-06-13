#Date: 2018-06-13
#Filename: gate_conf.py
###############################################################################
import requests
import argparse


class etcd_v2:
    def __init__(self, etcd_host, etcd_port, etcd_root, etcd_gid):
        self.base_gm_url = "http://%s:%s/v2/keys%s/%s/" % (etcd_host, etcd_port, etcd_root, etcd_gid)
    def get_gm_data_info(self, shard_id):
        try:
            redis_host = requests.get(url=self.base_gm_url+'%s/gm/redis' % shard_id).json()['node']['value']
            redis_num = requests.get(url=self.base_gm_url+'%s/gm/redis_db' % shard_id).json()['node']['value']
            merge_rel = requests.get(url=self.base_gm_url+'%s/merge_rel' % shard_id).json()['node']['value']
            return shard_id, merge_rel, redis_host, redis_num
        except KeyError,e:
            print 'Error: Please check etcd config and you request shard!'

class write_conf:
    def __init__(self, etcd_info, out_dir):
        self.out_dir = out_dir
        self.shardID = etcd_info[0]
        self.mergeRel = etcd_info[1]
        self.redis_host = etcd_info[2]
        self.redis_num = etcd_info[3]
    def write(self):
        config_file = self.redis_host + '.conf'
        with open(config_file.replace('.', '-', 3).replace(':', '_') , 'a+') as f1:
            f1.write('[[DBInfo]]' + '\n')
            f1.write('shard = %s' % self.shardID + '\n')
            f1.write('merge = %s' % self.mergeRel + '\n')
            f1.write('dbname = %s' % self.redis_host + '\n')
            f1.write('dbnumber = %s' % self.redis_num  + '\n'*2)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(argument_default=argparse.SUPPRESS)
    parser.add_argument('-g', '--gid', default=False, dest='gid', required=True, help='Input GID number')
    parser.add_argument('-b', '--begin', type=int, default=False, dest='begin', required=True, help='Input a number to begin loop, like 1001')
    parser.add_argument('-e', '--end', type=int, default=False, dest='end', required=True, help='Input a number to stop loop, like 1999')
    args = parser.parse_args()

    # if args.begin and args.end and args.:
    v2_data = etcd_v2('host', '2379', '/SL200', args.gid)
    write_record = []
    for each_num in range(int(args.begin), int(args.end)):
        ready_write = v2_data.get_gm_data_info(each_num)
#    print each_num, type(each_num)
        if str(each_num).decode() not in write_record:
            write_conf(v2_data.get_gm_data_info(each_num),'haha.conf').write()
            write_record = write_record + ready_write[1].split(',')
