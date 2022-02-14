#!/bin/env python

from ansible.parsing.dataloader import DataLoader
from ansible.inventory.manager import InventoryManager
import collections
import re
from math import ceil
import copy
import os

loader = DataLoader()

inventory_path = './host.yml'
base_dir = "./"
inventory = InventoryManager(loader=loader, sources=inventory_path)


def get_group_host(groupName):
    hosts = inventory.get_groups_dict().get(groupName)
    return hosts

def add_shards(shards):
    nss = re.split(',|-', str(shards))
    if len(nss) > 1:
        nss = range(int(nss[0]),int(nss[1])+1)
    nss = [str(i) for i in  nss]
    nss.reverse()

    ass = [] + nss
    ah = {}
    for eh in get_group_host("gamex"):
        sl = inventory.get_host(eh).get_vars().get("serverlist")
        oss = str(sl).split('|')
        ah[eh] = oss
        ass += oss
    # check shard
    same_shard = [item for item, count in collections.Counter(ass).items() if count > 1]
    if len(same_shard) > 0:
        raise Exception("These shard is exist%s" % same_shard)
    # create shard file
    create_shard_etcd(base_dir,nss)
    # Get each host should be have shard nums
    oah = copy.deepcopy(ah)
    nums = int(ceil(float(len(ass)) / len(get_group_host("gamex"))))
    while len(nss) > 0:
        for ehost in get_group_host("gamex"):
            if len(ah[ehost]) >= nums:
                continue
            if len(nss) == 0:
                break
            shard = nss.pop()
            ah[ehost].append(shard)
    replace_inventory_content(inventory_path,oah,ah)


def replace_inventory_content(file,old_data,new_data):
    fin = open(file, "rt")
    data = fin.read()
    fin.close()
    rst = data
    for i in new_data:
        if new_data[i] != old_data[i]:
            old_str = "\|".join(old_data[i])
            new_str = "|".join(new_data[i])
            rst = re.sub(r"(\S+)(\s+)(server=gamex)(\s+)"+"serverlist='" +old_str +"'", r"\1\2\3\4"+ "serverlist='" + new_str +"'", rst)
            rst = re.sub(r"(\S+)(\s+)(server=scene)(\s+)"+"serverlist='" +old_str +"'", r"\1\2\3\4"+ "serverlist='" + new_str +"'", rst)
    fin = open(file, "wt")
    fin.write(rst)
    fin.close()

def create_shard_etcd(base_dir,nss):
    for s in nss:
        f1 = os.path.join(base_dir,"gamex",s)
        f2 = os.path.join(base_dir,"scene",s)
        if not os.path.exists(os.path.dirname(f1)):
            os.makedirs(os.path.dirname(f1))
        if not os.path.exists(os.path.dirname(f2)):
            os.makedirs(os.path.dirname(f2))
        with open(f1, 'w+') as f:
            f.write("shardid=%s" % (s))
        with open(f2, 'w+') as f:
            f.write("shardid=%s" % (s))
    print("success create shards:%s" % nss)


if __name__ == '__main__':
    add_shards("11-12")
