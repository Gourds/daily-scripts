#!/usr/bin/env python
# coding: utf-8
'''
boto3 API: https://boto3.readthedocs.io/
'''

import ConfigParser
from botocore.client import Config
from boto3.session import Session
from collections import Counter
import alarm_mail




aws_config = ConfigParser.ConfigParser()
aws_config.read('aws_config.ini')


class aws_ec2_info():
    def __init__(self,config_area):
        self.aws_region = aws_config.get(config_area, "aws_region")
        self.aws_access_key_id = aws_config.get(config_area, "aws_access_key_id")
        self.aws_secret_access_key = aws_config.get(config_area, "aws_secret_access_key")
        session = Session(aws_access_key_id=self.aws_access_key_id, aws_secret_access_key=self.aws_secret_access_key, region_name=self.aws_region)
        self.ec2 = session.resource('ec2',config=Config(signature_version='s3v4'))
        self.ec2_client = session.client('ec2',config=Config(signature_version='s3v4'))
    def get_ec2_type_list(self):
        instance_info = []
        for each_instance in self.ec2.instances.all():
            Name_index = [i for i, x in enumerate(each_instance.tags) if x['Key'].find('Name') != -1]
            # print each_instance.tags[Name_index[0]]['Value'], each_instance.instance_type, each_instance.private_ip_address,each_instance.public_ip_address
            instance_info.append([each_instance.tags[Name_index[0]]['Value'], each_instance.instance_type, each_instance.private_ip_address, each_instance.public_ip_address])
            #instance_info detail is: [Name, Type, Private_ip, Public_ip]
        return instance_info
    def get_purchase_status(self):
        purchase_info = []
        all_purchase = self.ec2_client.describe_reserved_instances(Filters=[{'Name': 'state', 'Values': ['active']}],OfferingType='No Upfront')['ReservedInstances']
        for each_order in all_purchase:
            # print each_order
            purchase_info.append([each_order['InstanceType'], each_order['InstanceCount'], each_order['Start'].strftime('%Y-%m-%d'), each_order['End'].strftime('%Y-%m-%d')])
        return purchase_info

class contant_format():
    def buy_used(self, buy_info, used_info):
        alarm_num = 0
        used_info = Counter(all_type_list)
        buy_info = Counter(all_type_pur)
        # print used_info, buy_info, type(used_info)
        all_info = Counter(used_info + buy_info)
        # print all_info
        # print list(all_info)
        from html import HTML
        inline_css = {
            'class1': 'color:#00FF00;width:500;valign:middle;vertical-line:top;', #green
            'class2': 'color:#FF0000;width:500;valign:middle;vertical-line:top;', #red
            'class3': 'color:#FFFF00;width:500;valign:middle;vertical-line:top;', #yellow
            'class4': 'color:#000000;width:500;valign:middle;vertical-line:top;', #black
        }

        b = HTML()
        t = b.table(border='1px solid black')
        r = t.tr()
        t2 = t.tr()
        t3 = t.tr()
        r.td('Type', style=inline_css['class4'])
        t2.td('Purd', style=inline_css['class4'])
        t3.td('Used', style=inline_css['class4'])
        for m_title in list(all_info):
            r.td(str(m_title), style=inline_css['class4'])
            if m_title in dict(buy_info).keys():
                # print dict(buy_info)[m_title]
                t2.td(str(dict(buy_info)[m_title]), style=inline_css['class1'])
            else:
                # print 'no key'
                t2.td('Null', style=inline_css['class2'])
            if m_title in dict(used_info).keys():
                # print dict(used_info)[m_title]
                t3.td(str(dict(used_info)[m_title]), style=inline_css['class1'])
            else:
                # print 'nn key'
                t3.td('Null', style=inline_css['class2'])
            if m_title in dict(buy_info).keys() and m_title in dict(used_info).keys():
                if dict(buy_info)[m_title] < dict(used_info)[m_title]:
                    # print 'haha %s' % m_title
                    alarm_num = alarm_num + 1
            elif m_title not in dict(buy_info).keys() and m_title in dict(used_info).keys():
                # print 'used but not buy: %s' % m_title
                alarm_num = alarm_num + 1
            # elif m_title in dict(buy_info).keys() and m_title not in dict(used_info).keys():
            #     print 'buy but not used: %s' % m_title

        alarm_info_ec2 = {'status':str(alarm_num), 'report':str(b)}
        # print alarm_info_ec2
        return alarm_info_ec2


if __name__ == '__main__':
    area_list = ['aws_cn', 'aws_hmt_tha', 'aws_ko', 'aws_vn']
    for each_area in area_list:
        # config_area = 'aws_hmt_tha'
        my_info = aws_ec2_info(each_area)
        all_info = my_info.get_ec2_type_list()
        all_purchase = my_info.get_purchase_status()
        all_type_list = []
        all_type_pur = []
        for each_instance in all_info:
            all_type_list.append(each_instance[1])
        for p_info in all_purchase:
            all_type_pur.extend(str('%s '% p_info[0] * p_info[1]).split())
        msg = contant_format().buy_used(all_purchase, all_type_list)
        # Alarm
        if msg['status'] > 0:
            alarm_mail.mail().send_html_mail('check@jump.org', 'guoyafeng@taiyouxi.cn', each_area, msg['report'])


