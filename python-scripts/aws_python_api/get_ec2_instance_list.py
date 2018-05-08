#!/usr/bin/env python
# coding: utf-8
'''
boto3 API: https://boto3.readthedocs.io/
'''

import ConfigParser
import datetime
from botocore.client import Config
from boto3.session import Session

config_region = 'aws_ko'
aws_config = ConfigParser.ConfigParser()
aws_config.read('aws_config.ini')
aws_region = aws_config.get(config_region, "aws_region")
aws_access_key_id = aws_config.get(config_region, "aws_access_key_id")
aws_secret_access_key = aws_config.get(config_region, "aws_secret_access_key")

class aws_ec2_info():
    def __init__(self,aws_region,aws_access_key_id,aws_secret_access_key):
        self.aws_region = aws_region
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
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


if __name__ == '__main__':
    my_info = aws_ec2_info(aws_region, aws_access_key_id, aws_secret_access_key)
    all_info = my_info.get_ec2_type_list()
    all_type_list = []
    for each_instance in all_info:
        all_type_list.append(each_instance[1])
    # print all_info
    # print list(set(all_type_list))
    # print my_info.get_purchase_status()
    for i in all_info:
        print i
