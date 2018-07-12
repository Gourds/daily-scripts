#!/usr/bin/env python
# coding: utf-8
############
#Notes:
############
import ConfigParser
import botocore
from botocore.client import Config
from boto3.session import Session
import argparse
import os


class aws_s3_info():
    def __init__(self,region, config_file):
        config_region = region
        aws_config = ConfigParser.ConfigParser()
        aws_config.read(config_file)
        self.aws_region = aws_config.get(config_region, "aws_region")
        self.aws_access_key_id = aws_config.get(config_region, "aws_access_key_id")
        self.aws_secret_access_key = aws_config.get(config_region, "aws_secret_access_key")
        session = Session(aws_access_key_id=self.aws_access_key_id,aws_secret_access_key=self.aws_secret_access_key,region_name=self.aws_region)
        self.s3 = session.resource('s3',config=Config(signature_version='s3v4'))
        self.s3_client = session.client('s3',config=Config(signature_version='s3v4'))
    def list_bucket(self):
        for bucket in self.s3.buckets.all():
            print(bucket.name)
    def list_objects(self, bucket, prefix=''):
        for each_ob in self.s3_client.list_objects(Bucket=bucket,Prefix=prefix)['Contents']:
            print each_ob['Key']
    def download_bojects(self, bucket, prefix, out_dir):
        if not os.path.exists(out_dir):
            os.makedirs(out_dir)
        try:
            for each_ob in self.s3_client.list_objects(Bucket=bucket, Prefix=prefix)['Contents']:
                print 'Download %s ...' % each_ob['Key']
                self.s3_client.download_file(bucket, each_ob['Key'], os.path.join(out_dir,os.path.basename(each_ob['Key'])))
        except botocore.exceptions.ClientError as e:
            if e.response['Error']['Code'] == "404":
                print("The object does not exist.")
            else:
                raise

if __name__ == '__main__':
    #
    first_parser= argparse.ArgumentParser(add_help=False)
    first_parser.add_argument('-r', '--region', dest='area',choices=['aws_cn','aws_hmt_tha','aws_ko','aws_jp'],required=True, help='Choice the region')
    parser = argparse.ArgumentParser(description='S3 manage scripts, Add by 20180712')
    sub_parsers = parser.add_subparsers(title='sub command', dest='sub_command')
    #list bucket or objects
    parser_list = sub_parsers.add_parser('ls',parents=[first_parser],description="list bucket or object with prefix")
    parser_list.add_argument('-b', '--bucket', dest='lbucket', required=False, help='The bucket name')
    parser_list.add_argument('-p', '--prefix', dest='prefix', required=False, help='prefix your want ,if not only show bucket list')
    #download
    parser_download = sub_parsers.add_parser('download',parents=[first_parser],description="Download file from s3")
    parser_download.add_argument('bucket', help='Input bucket name')
    parser_download.add_argument('prefix', help='Download file which you want')
    parser_download.add_argument('out_dir', help='Save file path')
    args = parser.parse_args()
    #switch
    my_want = aws_s3_info(args.area, 'aws_config.ini')
    if args.sub_command =='ls':
        if args.lbucket and not args.prefix:
            my_want.list_objects(args.lbucket)
        elif args.lbucket and args.prefix:
            my_want.list_objects(args.lbucket, args.prefix)
        else:
            my_want.list_bucket()
    elif args.sub_command == 'download':
        my_want.download_bojects(args.bucket, args.prefix, args.out_dir)
