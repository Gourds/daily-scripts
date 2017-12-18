# 方法1： Linux命令
  注意：需要安装sendmail 及 mailx
  - 例1
  echo "内容" |mail -s "标题" guoyafeng@taiyouxi.cn
  - 例2: 读取指定文件内容作为邮件的内容发送
  mail -s '标题' support@sijitao.net < /pikaqiu/文件路径


# 方法2：python库
  参考：https://www.cnblogs.com/lonelycatcher/archive/2012/02/09/2343463.html
