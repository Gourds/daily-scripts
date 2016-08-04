#!/usr/bin/python
# -*- coding:utf-8 -*-
###############################################################################
#Author: arvon
#Email: yafeng2011@126.com
#Blog: http://arvon.top/
#Date: 2016/08/04
#Filename: excel_write_inventory.py
#Revision: 1.0
#License: GPL
#Description: use xlrd module auto create vars and file for ansible
#Notes:
###############################################################################
import os
from mmap import mmap,ACCESS_READ
from xlrd import open_workbook
#vars
inventory_path = './'
inventory_file = 'inventory-list.yml'
excel_file = 'test.xlsx'

#var define
data = open_workbook(excel_file)
table = data.sheets()[0]
nrows = table.nrows
ncols = table.ncols

#functions list
#write title to inventory file
def write_title():
    f = open(inventory_path + inventory_file, 'w')
    input_msg = \
'''\
hosts_ops_path: /data/ps/ops-repo/
inventory:
  name: ssy
  hosts:
'''
    f.write(input_msg)
    f.close
#write redis hosts
def write_hosts(row_num,host_name,group_name,host_num = 1):
#    print db_list
    for each_line_num in range(nrows):
        each_line = table.row_values(each_line_num)
        if each_line[row_num] == 1:
            f = open(inventory_path + inventory_file, 'a')
            f.write('  - name: '+ host_name + str(host_num) + '\n')
            host_num = host_num + 1
            f.write('    ip: ' + str(each_line[1]) + '\n')
            f.write('    group: '+ group_name + '\n')
            f.write("\n")
            f.close
#use functions
write_title()
write_hosts(4,'ssy-db','dbserver')
write_hosts(5,'ssy-redis','redis')
write_hosts(6,'ssy-zk','zookeeper')
write_hosts(7,'ssy-kafka','kafka')
write_hosts(8,'ssy-mysql','mysql')
write_hosts(9,'ssy-rest','rest')
write_hosts(10,'ssy-thrift','thrift')
write_hosts(11,'ssy-push','push')
write_hosts(12,'ssy-db-ejabberd','ejabberd-db')
write_hosts(13,'ssy-conn-ejabberd','ejabberd-conn')
write_hosts(14,'ssy-nginx','nginx')
write_hosts(15,'ssy-web','web')
write_hosts(16,'ssy-turn','turn')
write_hosts(17,'ssy-media','media')
write_hosts(18,'ssy-coference','coference')
