#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/07/30 10:00 PM
# @Author  : gourds
# @Contact : gourds@yeah.com
# @File    : upload2ftp.py

from ansible.module_utils.basic import *

module = AnsibleModule(
        argument_spec = dict(
                 ftp_host=dict(required=True),
                 ftp_port=dict(required=True),
                 ftp_user=dict(required=True),
                 ftp_pass=dict(required=True),
                 ftp_local_file=dict(required=True),
                 ftp_remote_file=dict(required=True),
        ),
)

from ftplib import FTP
from ftplib import error_perm
import os
import socket


def ftpconnect(host, port, username, password):
    ftp = FTP()
    # ftp.set_debuglevel(2)         #打开调试级别2，显示详细信息
    ftp.encoding = 'utf-8'  # 解决中文编码问题，默认是latin-1
    try:
        ftp.connect(host, port)  # 连接
        ftp.login(username, password)  # 登录，如果匿名登录则用空串代替即可
        # print(ftp.getwelcome())  # 打印欢迎信息
    except(socket.error, socket.gaierror):  # ftp 连接错误
        # print("ERROR: cannot connect [{}:{}]" .format(host, port))
        return None
    except error_perm:  # 用户登录认证错误
        print("ERROR: user Authentication failed ")
        return None
    return ftp



def uploadfile(ftp, remotepath, localpath):
    bufsize = 1024
    fp = open(localpath, 'rb')
    try:
        ftp.cwd(os.path.dirname(remotepath))
        # ftp.dir(os.path.dirname(remotepath))
    except:
        ftp.mkd(os.path.dirname(remotepath))
        ftp.cwd(os.path.dirname(remotepath))
    res = ftp.storbinary('STOR ' + os.path.basename(localpath), fp, bufsize)  # 上传文件
    if res.find('226') != -1:
        return 'upload file complete:{}'.format(os.path.basename(localpath))
    ftp.set_debuglevel(0)
    fp.close()



session = ftpconnect(host=module.params['ftp_host'],
                     port=int(module.params['ftp_port']),
                     username=module.params['ftp_user'],
                     password=module.params['ftp_pass'],
                     )
rst = uploadfile(ftp=session,
           remotepath=module.params['ftp_remote_file'],
           localpath=module.params['ftp_local_file'],
           )

result = dict(module='upload2ftp',stdout=rst,changed=False,rc=0)

module.exit_json(**result)
