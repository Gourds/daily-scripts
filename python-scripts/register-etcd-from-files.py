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
'''


import os
import sys
import etcd
import requests

try:
    directory = sys.argv[2]
    etcddir = sys.argv[1]
    etcdhost = sys.argv[3]
except IndexError as e:
    print 'Usage: %s /etcd_root to_register_dir etcd_address' % sys.argv[0]
    exit(7)

def get_regist_file():
    try:
        for file_path in os.listdir(directory):
            if os.path.isfile(os.path.join(directory,file_path)):
                key_file = os.path.join(directory,file_path)
                get_file_value(key_file)
            else:
                for root,dirs,file_name in os.walk(os.path.join(directory,file_path),topdown=False):
                    for v_file in file_name:
                        key_file = os.path.join(root,v_file)
                        # print key_file
                        get_file_value(key_file)
                    for v_dir in dirs:
                        key_dir = os.path.join(root,v_dir)
                        try:
                            requests.post('http://%s:2379/v2/keys%s/%s' % (etcdhost, etcddir, key_dir),
                                          data={'dir': True})
                        except requests.exceptions.ConnectionError as e:
                            print 'Check Address: %s' % (etcdhost)
                            exit(7)
    except OSError as e:
        print 'Check the Path: %s' % (directory)
        exit(8)

def get_file_value(file_path):
    if os.path.getsize(file_path) == 0:
        try:
            requests.post('http://%s:2379/v2/keys%s/%s' %(etcdhost,etcddir,file_path ), data={'dir':True})
            #print 'http://%s:2379/v2/keys%s/%s' %(etcdhost,etcddir,file_path )
        except requests.exceptions.ConnectionError as e:
            print 'Check Address: %s' % (etcdhost)
            exit(7)
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
            resist_to_etcd(os.path.join(etcddir, file_path,line_key),line_value)
            # return (line_key,line_value)

def resist_to_etcd(m_key,m_value):
    try:
        client = etcd.Client(host=etcdhost, port=2379)
        client.write(m_key,m_value)
    except AttributeError as e:
        print 'Please check the address %s' % (etcdhost)
        exit(7)

if __name__ == '__main__':
    get_regist_file()
    # get_file_value('150/shards/15005')
