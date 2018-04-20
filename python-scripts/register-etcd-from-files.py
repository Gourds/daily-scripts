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
        for root,dirs,file_name in os.walk(directory,topdown=False):
            for v_file in file_name:
                key_file = os.path.join(root,v_file)
                #print key_file
                get_file_value(key_file)
            for v_dir in dirs:
                key_dir = os.path.join(root,v_dir)
                # print key_dir
                try:
                    requests.put('http://%s:2379/%s/keys%s/%s' % (etcdhost, etcd_api_version, etcddir, key_dir),
                                  data={'dir': True})
                    #print 'http://%s:2379/v2/keys%s/%s' % (etcdhost, etcddir, key_dir)
                except requests.exceptions.ConnectionError as e:
                    print 'Line 49 Check Address: %s' % (etcdhost)
                    exit(7)
    except OSError as e:
        print 'Line 52 Check the Path: %s' % (directory)
        exit(8)

def get_file_value(file_path):
    if os.path.getsize(file_path) == 0:
        try:
            requests.put('http://%s:2379/%s/keys%s/%s' %(etcdhost, etcd_api_version, etcddir, file_path ), data={'dir':True})
            # print 'http://%s:2379/v2/keys%s/%s' %(etcdhost,etcddir,file_path )
        except requests.exceptions.ConnectionError as e:
            print 'Line 61 Check Address: %s' % (etcdhost)
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
                regist_api_etcd(etcd_api_version,os.path.join(etcddir, file_path, line_key), line_value)
                #regist_http_etcd(etcd_api_version,os.path.join(etcddir, file_path, line_key), line_value)
            # return (line_key,line_value)

def regist_api_etcd(api_version, m_key,m_value):
    if api_version == 'v2':
        requests.put('http://%s:2379/%s/keys%s' % (etcdhost, etcd_api_version, m_key), data={'value': m_value})
        #try:
        #import etcd
        #client = etcd.client(host=etcdhost, port=2379)
        #client.write(m_key,m_value)
        #except AttributeError as e:
        #    print 'Line 89 Please check the address %s' % (etcdhost)
        #    exit(7)
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
