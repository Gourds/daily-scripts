#!/usr/bin/python
# -*- coding:utf-8 -*-
###############################################################################
#Author: arvon
#Email: yafeng2011@126.com
#Blog: http://arvon.top/
#Date: 2017/04/18
#Filename: print_dhcp.py
#Revision: 1.1
#License: GPL
#Description: use xlrd module auto create dhcp config file
#Notes:
###############################################################################
import sys
from xlrd import open_workbook
excel_file = './mac.xls'
dhcp_conf_file = './dhcp_conf.txt'
data = open_workbook(excel_file)
table = data.sheets()[0]
nrows = table.nrows

#functions
reload(sys)
sys.setdefaultencoding( "utf-8" )
f = open(dhcp_conf_file, 'w')
f.write('dhcp-option=6,10.0.1.8' + '\n')
#write title to inventory file
for each_line_num in range(1,nrows):
    each_line = table.row_values(each_line_num)
#    print each_line
    if each_line[4]: 
        p_mac=each_line[4]
        p_ip=each_line[5]
        p_commit=each_line[8]
#        print 'dhcp-host=' + p_mac + ',' + p_ip + ',' + p_commit
        f.write('dhcp-host=' + p_mac + ',' + p_ip + ',' + p_commit + '\n')
f.close
