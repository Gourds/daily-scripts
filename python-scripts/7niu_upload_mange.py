#!/usr/bin/python
# -*- coding:utf-8 -*-
###############################################################################
#Author: arvon
#Email: yafeng2011@126.com
#Blog: http://blog.arvon.top/
#Date: 2018/01/11
#Filename: 7niu_upload_manage.py
#Revision: 1.0
#License: GPL
#Description: manage 7niu uplaod and download and delete
#Notes: pip install qiniu -i http://pypi.douban.com/simple --trusted-host pypi.douban.com
###############################################################################

from qiniu import Auth, put_file, etag, BucketManager, build_batch_delete
import requests
from contextlib import closing
import os
import sys
import argparse

class qiniu():
    def __init__(self):
        self.access_key = "your key"
        self.secret_key = "your key"
        self.mdomain = "your domain"
        self.mauth = Auth(self.access_key, self.secret_key)
    def upload(self, upload_dir, upload_bucket):
        if os.path.isdir(upload_dir):
            up_file_list = []
            for root, dirs, files in os.walk(upload_dir,topdown=True):
                for v_file in files:
                    up_file_list.append(os.path.join(root, v_file))
            for file_name in up_file_list:
                token = self.mauth.upload_token(upload_bucket, file_name)
                ret, info = put_file(token, file_name, file_name)
                # print(info)
                assert ret['key'] == file_name
                assert ret['hash'] == etag(file_name)
                print ret
        elif os.path.isfile(upload_dir):
            token = self.mauth.upload_token(upload_bucket, file_name)
            ret, info = put_file(token, file_name, file_name)
            assert ret['key'] == file_name
            assert ret['hash'] == etag(file_name)
            print ret
    def list(self, bucket_name, prefix, limit=5):
        bucket = BucketManager(self.mauth)
        delimiter = None
        marker = None
        ret, eof, info = bucket.list(bucket_name, prefix, marker, limit, delimiter)
        for item in ret.get('items'):
            print "{Name: %s Size:%s Hash:%s}" % (item['key'], item['fsize'], item['hash'])
    def download(self, filename, output_dir):
        base_url = 'http://%s/%s' % (self.mdomain, filename)
        private_url = self.mauth.private_download_url(base_url)
        if os.path.exists(output_dir):
            os.chdir(output_dir)
        else:
            os.makedirs(output_dir)
            os.chdir(output_dir)
        res = requests.get(private_url, stream=True)
        with closing(res) as r:
            accepts = 0
            chunk_size = 512
            with open(os.path.basename(filename), "wb") as code:
                for chunk in r.iter_content(chunk_size=chunk_size):
                #downlaod big data optimization；old mathed is  code.write(r.content)
                    code.write(chunk)
                    accepts += len(chunk)
                    # print accepts, int(r.headers['Content-Length'])
                    progress = round(float(accepts) / int(r.headers['Content-Length']), 4) * 100
                    sys.stdout.write('\r' + 'Now downlaod ' + str(progress) + '%')
                    sys.stdout.flush()
        assert res.status_code == 200

    def delete(self, bucket_name, del_list):
        mbucket = BucketManager(self.mauth)
        del_item = build_batch_delete(bucket_name, del_list)
        ret, info = mbucket.batch(del_item)
        print info

if __name__ == '__main__':
    first_parser= argparse.ArgumentParser(add_help=False)
    parser = argparse.ArgumentParser(description='haha')
    sub_parsers = parser.add_subparsers(title='sub command', dest='sub_command')
    #upload
    parser_upload = sub_parsers.add_parser('upload',parents=[first_parser],description="Upload to 7niu")
    parser_upload.add_argument('local_dir', help='Input your want uplaod dir name')
    parser_upload.add_argument('remote_bucket', help='Input remote bucket name')
    #list
    parser_list = sub_parsers.add_parser('list',parents=[first_parser],description="List 7niu file list base prefix")
    parser_list.add_argument('lbucket', help='The bucket name')
    parser_list.add_argument('prefix', help='Which prefix file you want')
    #download
    parser_download = sub_parsers.add_parser('download',parents=[first_parser],description="Download file from 7niu")
    parser_download.add_argument('dfilename', help='Download file which you want')
    parser_download.add_argument('out_dir', help='Save file path')
    #delete
    parser_delete = sub_parsers.add_parser('delete',parents=[first_parser],description="Delete 7niu bucket file")
    parser_delete.add_argument('ubucket', help='The bucket name')
    parser_delete.add_argument('ufilename', nargs='*', help='The file name your want delete, support mulitiple file')
    args = parser.parse_args()
    #switch
    server = qiniu()
    if args.sub_command == 'upload':
        server.upload(args.local_dir, args.remote_bucket)
        # print 'upload', args.local_dir, args.remote_bucket
    elif args.sub_command =='list':
        server.upload(args.lbucket, args.prefix)
        # print 'list', args.lbucket, args.prefix
    elif args.sub_command == 'download':
        server.download(args.dfilename, args.out_dir)
        # print 'download', args.dfilename, args.out_dir
    elif args.sub_command == 'delete':
        server.delete(args.ubucket, args.ufilename)
        # print 'delete', args.ubucket, args.ufilename
