#!/usr/bin/env python
#Email: arvon2014@gmail.com
#By guoyafeng
#Date: 2018/04/17
#Notes
'''
1. Support configuration annotation
2. Support for registering null values. like "value="
3. Support for registration of recursive directories
4. Add exception capture
5. Add null file support
6. Add null dircectory support
7. Add etcd v3 api support
8. Support e3w https://github.com/soyking/e3w
'''


import os
import sys
import requests

try:
    directory = sys.argv[2]
    etcddir = sys.argv[1]
    etcdhost = sys.argv[3]
    etcd_api_version = 'v3' # string v2 or v3 is available
except IndexError as e:
    print 'Usage: %s /etcd_root to_register_dir etcd_address' % sys.argv[0]
    exit(7)


def get_regist_file():
    try:
        create_etcd_dir(etcd_api_version, etcddir)
        for root,dirs,file_name in os.walk(directory,topdown=False):
            create_etcd_dir(etcd_api_version, os.path.join(etcddir, root))
            for v_dir in dirs:
                c_dir_name = os.path.join(etcddir,root,v_dir)
                create_etcd_dir(etcd_api_version,c_dir_name)
            for v_file in file_name:
                key_file = os.path.join(root,v_file)
                c_dir_name = os.path.join(etcddir, root, v_file)
                create_etcd_dir(etcd_api_version, c_dir_name)
                get_file_value(key_file)
    except OSError as e:
        print 'Line %s Check the Path: %s' % (sys._getframe().f_lineno,directory)
        exit(8)

def create_etcd_dir(etcd_version,dir_name):
    # print etcd_version,dir_name
    if etcd_version == 'v2':
        try:
            requests.put('http://%s:2379/%s/keys%s' % (etcdhost, etcd_api_version, dir_name),
                              data={'dir': True})
        except requests.exceptions.ConnectionError as e:
            print 'Line %s Error Check Address: %s' % (sys._getframe().f_lineno,etcdhost)
    elif etcd_version == 'v3':
        regist_api_etcd(etcd_version, dir_name, 'etcdv3_dir_$2H#%gRe3*t')
        '''
        must use etcdv3_dir_$2H#%gRe3*t as the value can support e3w
        '''
    else:
        print 'Line %s Error version option: %s' % (sys._getframe().f_lineno ,etcd_version)
        exit(2)

def get_file_value(file_path):
    with open(file_path,'r') as f1:
        for each_line in f1.readlines():
            if each_line.startswith('#'):
                #print "WARIN: comment syntax %s is ignore" % (each_line)
                pass
            elif each_line.startswith('@'):
                pass
            elif each_line.startswith('='):
                pass
            elif '=' in each_line:
                line_key = each_line.split('=')[0]
                if each_line.split('=')[1]:
                    line_value = each_line.split('=')[1]
                else:
                    line_value = 'Null'
                print os.path.join(etcddir,file_path,line_key),line_value
                regist_api_etcd(etcd_api_version,os.path.join(etcddir, file_path, line_key), line_value)

def regist_api_etcd(api_version, m_key,m_value):
    if api_version == 'v2':
        try:
            requests.put('http://%s:2379/%s/keys%s' % (etcdhost, etcd_api_version, m_key), data={'value': m_value})
        except requests.exceptions.ConnectionError as e:
            print 'Line %s Error Check Address: %s' % (sys._getframe().f_lineno, etcdhost)
    elif api_version == 'v3':
        try:
            import etcd3
            client = etcd3.client(host=etcdhost, port=2379)
            client.put(m_key, m_value)
        except AttributeError as e:
            print 'Line 97 Please check the address %s' % (etcdhost)
            exit(7)
        except ImportError as e:
            print 'Make sure install etcd3 module'


if __name__ == '__main__':
    get_regist_file()
    # get_file_value('150/shards/15005')
