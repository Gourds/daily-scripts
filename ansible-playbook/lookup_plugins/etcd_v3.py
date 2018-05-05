###############################################################################
#Author: arvon
#Email: arvon2014@gmail.com
#Date: 2018/05/05
#Description: register etcd v3 and used by ansible lookup
#Notes:
###############################################################################

from ansible.plugins.lookup import LookupBase
import etcd3
import os

'''
Require and Document
pip install etcd3
V3-api: http://python-etcd3.readthedocs.io/en/latest/usage.html
'''


class Etcd_v3:
    def __init__(self, prefix, shardsinfo, ANSIBLE_ETCD_URL, type_module):
        self.prefix = prefix
        #self.version = version
        self.shardsinfo = shardsinfo
        self.etcd_url = ANSIBLE_ETCD_URL
        self.port = 2379
        self.type_module = type_module

    def gets(self):
        client = etcd3.client(host=self.etcd_url, port=self.port)
        client.get_prefix()
        return_dict = {}
        for shardid in self.shardsinfo:
            assign_dict = {}
            v3_prefix = os.path.join(self.prefix, str(self.shardsinfo[shardid]['gid']),self.type_module, str(shardid))
            #print v3_prefix
            gid = str(self.shardsinfo[shardid]['gid'])
            for v3_kv in client.get_prefix(v3_prefix, sort_order=None, sort_target='key'):
                #print v3_kv[1].key, v3_kv[0]
                assign_dict[v3_kv[1].key.split('/')[-1]] = v3_kv[0]
            default_prefix = os.path.join(self.prefix, gid, 'default')
            for default_kv in client.get_prefix(default_prefix, sort_order=None, sort_target='key'):
                #print default_kv[1].key,  default_kv[0]
                assign_dict[default_kv[1].key.split('/')[-1]] = default_kv[0]
            return_dict[shardid] =  assign_dict
        return return_dict
        # if self.type_module == 'gamex':
        #     for shardid in self.shardsinfo:
        #         assign_dict = {}
        #         v3_prefix = os.path.join(self.prefix, str(self.shardsinfo[shardid]['gid']),str('shards'), str(shardid))
        #         #print v3_prefix
        #         gid = str(self.shardsinfo[shardid]['gid'])
        #         for v3_kv in client.get_prefix(v3_prefix, sort_order=None, sort_target='key'):
        #             #print v3_kv[1].key, v3_kv[0]
        #             assign_dict[v3_kv[1].key.split('/')[-1]] = v3_kv[0]
        #         default_prefix = os.path.join(self.prefix, gid, 'default')
        #         for default_kv in client.get_prefix(default_prefix, sort_order=None, sort_target='key'):
        #             #print default_kv[1].key,  default_kv[0]
        #             assign_dict[default_kv[1].key.split('/')[-1]] = default_kv[0]
        #         return_dict[shardid] =  assign_dict
        #     return return_dict
        # elif self.type_module == 'auth':
        #     for shardid in self.shardsinfo:
        #         assign_dict = {}
        #         v3_prefix = os.path.join(self.prefix, str(self.shardsinfo[shardid]['gid']),str('auth'), str(shardid))
        #         gid = str(self.shardsinfo[shardid]['gid'])
        #         for v3_kv in client.get_prefix(v3_prefix, sort_order=None, sort_target='key'):
        #             assign_dict[v3_kv[1].key.split('/')[-1]] = v3_kv[0]
        #         default_prefix = os.path.join(self.prefix, gid, 'default')
        #         for default_kv in client.get_prefix(default_prefix, sort_order=None, sort_target='key'):
        #             assign_dict[default_kv[1].key.split('/')[-1]] = default_kv[0]
        #         return_dict[shardid] =  assign_dict
        # else:
        #     pass

class LookupModule(LookupBase):

    def run(self, terms, variables, **kwargs):
        # validate_certs = kwargs.get('validate_certs', True)
        if len(terms) != 4:
            raise AnsibleError("parameter should be 4. prefix, dict of shardsinfo")
        etcd = Etcd_v3(terms[0], terms[1], terms[2], terms[3])
        return [etcd.gets()]


# Test command
if __name__ == '__main__':
    etcd = Etcd_v3('root_v3/wpys', {'15501':{'gid':155}},'10.17.1.32','gamex')
    #etcd = Etcd_v3('root_v3/wpys', {'15501': {'gid': 155},'15502':{'gid':155}}, '10.17.1.32', 'gamex')
    #a=etcd.gets('root_v3/wpys', {'15501':{'gid':155}},'http://10.17.1.32:2379','gamex')
    a=etcd.gets()
    print (a)
