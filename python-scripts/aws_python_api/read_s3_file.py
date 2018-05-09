#!/usr/bin/env python
# coding: utf-8
############
#Notes:
############
import sys
import getopt
import ConfigParser
import botocore
from botocore.client import Config
from boto3.session import Session

config_region = 'aws_ko'
aws_config = ConfigParser.ConfigParser()
aws_config.read('aws_config.ini')
aws_region = aws_config.get(config_region, "aws_region")
aws_access_key_id = aws_config.get(config_region, "aws_access_key_id")
aws_secret_access_key = aws_config.get(config_region, "aws_secret_access_key")
class aws_s3_info():
    def __init__(self):
        self.aws_region = aws_region
        self.aws_access_key_id = aws_access_key_id
        self.aws_secret_access_key = aws_secret_access_key
        session = Session(aws_access_key_id=self.aws_access_key_id,aws_secret_access_key=self.aws_secret_access_key,region_name=self.aws_region)
        self.s3 = session.resource('s3',config=Config(signature_version='s3v4'))
        self.s3_client = session.client('s3',config=Config(signature_version='s3v4'))
    def print_s3_bucket_list(self):
        for bucket in self.s3.buckets.all():
            print(bucket.name)
    def list_bucket_objects(self,bucket_name):
        # A = self.s3_client.list_objects(Bucket=bucket_name)#, Delimiter='string', EncodingType='url',RequestPayer='requester')
        # print A['Contents']#A,A['ResponseMetadata']
        for each_ob in  self.s3_client.list_objects(Bucket=bucket_name)['Contents']:
            print(each_ob['Key'])
    def cat_object_single(self,bucket_name,ob_name):
        try:
            self.s3.Bucket(bucket_name).download_file(ob_name,'/Users/arvon/Downloads/'+ob_name)
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                print("The object does not exist.")
            else:
                raise
        f = open('/Users/arvon/Downloads/'+ob_name,'r')
        print f.read()
        f.close()


if __name__ == '__main__':
    my_want = aws_s3_info()
    #print sys.argv
    if len(sys.argv) == 0:
        my_want.print_s3_bucket_list()
    elif len(sys.argv) == 1:
        #my_want.list_bucket_objects('test-read-s3')
        my_want.list_bucket_objects(sys.argv[1])
    elif len(sys.argv) == 2:
        # my_want.cat_object_single('test-read-s3', 'Redis-learn.md')
        my_want.cat_object_single(sys.argv[1], sys.argv[2])

