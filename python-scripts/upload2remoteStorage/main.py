# -*- coding: utf-8 -*-
from __future__ import print_function

import configparser
import logging
import argparse
import os, sys
import re


# version = '1.0'
support_types = ['OSS', 'OBS', 'S3', 'KS3', 'demo']
config_path = 'config.ini'
config = configparser.ConfigParser()
config.optionxform = str
config.read(config_path)

#log
logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
    '%(asctime)s Line: %(lineno)d %(levelname)-8s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

#opts
def get_opts():
    parser = argparse.ArgumentParser(
        description='Upload files to object storage'
    )
    parser.add_argument('-v', '--version', action='version',
                        version='%(prog)s 1.0', help='show version')
    parser.add_argument('-c', '--config', choices=config.sections(),dest='_config',required=True,
                        help='Select config selection, Ex: abc')
    parser.add_argument('-t', '--type', choices=support_types, action='store',dest='type')
    parser.add_argument('--endpoint', action='store', dest='endpoint', nargs='?',default=None,
                        help='Input endpoint')
    parser.add_argument('--accessKeyID', action='store', dest='accessKeyID', nargs='?',
                        help='Input accessKeyID')
    parser.add_argument('--accessKeySecret', action='store', dest='accessKeySecret', nargs='?',
                        help='Input accessKeySecret')
    parser.add_argument('-s', '--sourcePath', action='store', dest='src', required=True,
                        help='src file or path. egg: /some/file or /some/path/')
    parser.add_argument('-d', '--remotePath', action='store', dest='dst', required=True,
                        help='remote path. egg: oss://some/path')
    args = parser.parse_args()
    return args

def my_config():
    _args = vars(get_opts())
    deault_config = dict(config.items(_args.get('_config')))
    last_config = {**deault_config, **{k:v for k,v in _args.items() if v is not None}}

    pattern = '{type}://(.*?)/(.*)'.format(type=str(last_config.get('type')).lower().strip("'"))
    logger.debug(pattern)
    try:
        prog = re.compile(pattern)
        bucket = prog.match(last_config.get('dst')).group(1)
        base_root = prog.match(last_config.get('dst')).group(2)
        last_config['bucket'] = bucket
        last_config['base_root'] = base_root
    except:
        logger.error('type is error')
    return last_config

def local_files(path):

    os.path.exists(path)
    if os.path.isfile(path):
        logger.debug(msg='Input path {path:5s} is file'.format(path=path))
        return [os.path.relpath(path)]
    logger.debug(msg='Input path {path:5s} is dir'.format(path=path))
    _files = []
    for root,_,fs  in os.walk(path):
        for f in fs:
            _file = os.path.join(root,f)
            _files.append(os.path.relpath(_file))
    return _files

def uoload2demo(_config):
    _files = local_files(_config.get('src'))
    logger.debug(_files)
    logger.debug(_config)

def upload2aliyun(_config):
    import oss2
    auth = oss2.Auth(_config.get('accessKeyID'), _config.get('accessKeySecret'))
    bucket = oss2.Bucket(auth, _config.get('endpoint'), _config.get('bucket'))
    _files = local_files(_config.get('src'))
    def percentage(consumed_bytes, total_bytes):
        if total_bytes:
            rate = int(100 * (float(consumed_bytes) / float(total_bytes)))
            print('\r{0}% '.format(rate), end='')
            sys.stdout.flush()
    logger.info('-'*50 +'upload begin'+ '-'*50)
    for file in _files:
        ob_file = os.path.join(_config.get('base_root'),file)
        resp = bucket.put_object(ob_file, file, progress_callback=percentage)
        logging.info('upload {filename}s to {dst} {reason}'.format(filename=file, dst=_config.get('dst'), reason=resp.status))
    logger.info('-'*50 +'upload end'+ '-'*50)

def upload2huawei(_config):
    try:
        from obs import PutObjectHeader, ObsClient
        obsClient = ObsClient(
            access_key_id=_config.get('accessKeyID'),
            secret_access_key=_config.get('accessKeySecret'),
            server=_config.get('endpoint')
        )
        headers = PutObjectHeader()
        headers.contentType = 'text/plain'
        _files = local_files(_config.get('src'))
        logger.info('-'*50 +'upload begin'+ '-'*50)
        for file in _files:
            ob_file = os.path.join(_config.get('base_root'),file)
            resp = obsClient.putFile(_config.get('bucket'),
                                     ob_file, file,
                                     metadata=None, headers=headers)
            logging.info('upload {filename}s to {dst} {reason}'.format(filename=file, dst=_config.get('dst'), reason=resp.get('reason')))
        logger.info('-'*50 +'upload end'+ '-'*50)
    except:
        import traceback
        print(traceback.format_exc())

def upload2s3(_config):
    import boto3
    from botocore.exceptions import ClientError
    s3_client = boto3.client(
        's3',
        _config.get('region','cn-north-1'),
        aws_access_key_id=_config.get('accessKeyID'),
        aws_secret_access_key=_config.get('accessKeySecret'),
                             )
    _files = local_files(_config.get('src'))
    logger.info('-'*50 +'upload begin'+ '-'*50)
    for file in _files:
        try:
            ob_file = os.path.join(_config.get('base_root'),file)
            resp = s3_client.upload_file(file, _config.get('bucket'), ob_file)
            logging.info('upload {filename}s to {dst} {reason}'.format(filename=file, dst=_config.get('dst'), reason=resp or 'OK'))
        except ClientError as e:
            logging.error(e)
    logger.info('-'*50 +'upload end'+ '-'*50)

def upload2ks3(_config):
    from ks3.connection import Connection
    c = Connection(_config.get('accessKeyID'),
                   _config.get('accessKeySecret'),
                   host=_config.get('endpoint'))
    b = c.get_bucket(_config.get('bucket'))
    _files = local_files(_config.get('src'))
    logger.info('-'*50 +'upload begin'+ '-'*50)
    for file in _files:
        ob_file = os.path.join(_config.get('base_root'),file)
        k = b.new_key(ob_file)
        resp=k.set_contents_from_filename(file)
        logging.info('upload {filename}s to {dst} {reason}'.format(filename=file, dst=_config.get('dst'), reason=resp.status or 'OK'))
    logger.info('-'*50 +'upload end'+ '-'*50)

# def f(x): #support in python 3.10
#     match x:
#         case 'a':
#             return 1
#         case 'b':
#             return 2
#         case _:
#             return 0
#
# def f(x):
#     return {
#         'a': 1,
#         'b': 2
#     }.get(x, 9)


if __name__ == '__main__':
    cfg = my_config()
    logger.info(cfg)
    if cfg.get('type') == 'OSS':
        upload2aliyun(cfg)
    elif cfg.get('type') == 'OBS':
        upload2huawei(cfg)
    elif cfg.get('type') == 'S3':
        upload2s3(cfg)
    elif cfg.get('type') == 'KS3':
        upload2ks3(cfg)
    else:
        uoload2demo(cfg)
