


### 使用说明

**说明：** 主要用于文件上传至对象存储
- 支持配置文件及命令行（命令行会覆盖同名配置块）
- 支持子目录
- 支持文件及目录
- 支持多类型对象存储

```bash
#local env: python 3.9
pip install -r requirements.txt
```

```bash
main.py [-h] [-v] -c {j2-ali,j2-hw,j1-aws,j1-ks3} [-t {OSS,OBS,S3,KS3,demo}] [--endpoint [ENDPOINT]] [--accessKeyID [ACCESSKEYID]] [--accessKeySecret [ACCESSKEYSECRET]] -s SRC -d DST
```


### usage demo

```bash
python main.py -c j2-ali   -s ./test_dir -d oss://bucket/

python main.py -c j2-hw  -s ./test_dir -d obs://bucket/foo/bar

python main.py -c j2-ali -t S3  -s ./test_dir -d s3://bucket/

python main.py -c j1-aws -t S3   --accessKeyID key  --accessKeySecret secret  -s ./test_dir -d s3://bucket/

python main.py -c j1-ks3  -s ./test_dir -d ks3://bucket/

### support & Document

[x] Aliyun: https://help.aliyun.com/document_detail/88426.html
[ ] 微软云
[x] 华为云：https://sdkcenter.developer.huaweicloud.com/?product=obs
[x] aws: https://aws.amazon.com/cn/sdk-for-python/
[x] 金山云 ks3 https://console.huaweicloud.com/console/?region=cn-east-3#/obs/manage/jws2-ops-backup-data/object/list




```