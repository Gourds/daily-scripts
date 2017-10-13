#!/usr/bin/python
# -*- coding:utf-8 -*-
###############################################################################
#Author: arvon
#Email: yafeng2011@126.com
#Blog: http://blog.arvon.top/
#Date: 2017/09/12
#Filename: check_gamex_port.py
#Revision: 1.0
#License: GPL
#Description:
#Notes:
###############################################################################
import etcd
import re
import sys
import urllib2
import json

etcd_host='etcd.hello.net:2379'
url_base='/SL200/%s/' % (sys.argv[1])
client = etcd.Client(host=etcd_host, port=2379)
url_response = urllib2.urlopen('http://%s/v2/keys%s' %(etcd_host, url_base), timeout=5)
m_data = url_response.read()
data = json.loads(m_data)
shard_list = data.get('node').get('nodes')
def get_gamex_value(etcd_host,url_base,shardid,m_want):
    try:
        each_shard_get = urllib2.urlopen('http://%s/v2/keys%s/%s/%s/' %(etcd_host,url_base,shardid,m_want), timeout=5)
        each_shard_data = each_shard_get.read()
        each_shard_dict = json.loads(each_shard_data)
        m_want = each_shard_dict.get('node').get('value')
        return m_want
    except:
        print "URL is wrong..."
def get_shard_list():
    result_list=[]
    for i in shard_list:
        item = i.get('key')
        m_pattern = re.compile(r'%s+\d{4}' % url_base)
        match = m_pattern.match(item)
        if match:
            result_list.append(item.replace(url_base, ''))
    return result_list
def get_mdict():
    m_dict={}
    x_dict={}
    server_list=[]
    for i in get_shard_list():
        try:
            pub_port = get_gamex_value(etcd_host,url_base,i,'listen')
            int_rpc_port = get_gamex_value(etcd_host,url_base,i,'listen_rpcaddr_port')
            int_post_port = get_gamex_value(etcd_host,url_base,i,'listen_post_port')
            int_gamex_ip = re.sub(':\d{4}','',get_gamex_value(etcd_host,url_base,i,'internalip'),count=0,flags=0)
            shard_id = get_gamex_value(etcd_host,url_base,i,'shard_id')
            #print pub_port,int_rpc_port,int_post_port,int_gamex_ip,shard_id
            m_dict[shard_id] = {'int_gamex_ip':int_gamex_ip,'pub_port':pub_port,'int_rpc_port':int_rpc_port,'int_post_port':int_post_port}
            #m_dict['shards_list'] = {shard_id : {'int_gamex_ip':int_gamex_ip,'pub_port':pub_port,'int_rpc_port':int_rpc_port,'int_post_port':int_post_port}}
            server_list.append(int_gamex_ip)
        except:
            print "Keys is missing..."
    server_list = list(set(server_list))
    #print server_list
    x_dict =  {'shards_list': m_dict, 'servers_list': server_list}
    return x_dict
if __name__ == '__main__':
    #print type(get_mdict().get('shards_list').keys())
    #for i in get_mdict().get('shards_list').keys():
    result_dict = get_mdict().get('shards_list')
    result_list = get_mdict().get('servers_list')
    for each_server in result_list:
        each_server_gamex=[]
        for each_shard in result_dict.keys():
           if result_dict.get(each_shard).get('int_gamex_ip') == each_server:
               each_server_gamex.append(result_dict.get(each_shard).get('pub_port'))
               each_server_gamex.append(result_dict.get(each_shard).get('int_rpc_port'))
               each_server_gamex.append(result_dict.get(each_shard).get('int_post_port'))
        print each_server,list(set(each_server_gamex))
