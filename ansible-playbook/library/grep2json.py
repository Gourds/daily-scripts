#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/07/30 10:00 PM
# @Author  : gourds
# @Contact : gourds@yeah.com
# @File    : grep2json.py

from ansible.module_utils.basic import *

module = AnsibleModule(
        argument_spec = dict(
                 path=dict(required=True),
                 key=dict(required=True),
                 regular=dict(required=True),
        ),
)
s_path = module.params['path']
s_key = module.params['key']
s_filter = module.params['regular']
rst=[]
for root,dirs,file_name in os.walk(s_path,topdown=False):
    for v_file in file_name:
        if re.search(r'{}'.format(s_filter), v_file):
            single_dict={
                "type": s_key,
                "file": v_file
            }
            rst.append(single_dict)
rst = str(rst)
result = dict(module='grep2json',stdout=rst,changed=False,rc=0)

module.exit_json(**result)
