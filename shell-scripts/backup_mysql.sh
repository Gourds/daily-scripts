#!/bin/bash
ipaddr='localhost'
username='root'
password='root'
dest_dir='/data/mysql_data_bak'
function dump_db(){
all_area=`echo "show databases" | mysql -h${ipaddr} -u${username} -p${password} |egrep -v "information_schema|mysql|performance_schema|Database"`
for area in $all_area;do
mysqldump -h${ipaddr} -u${username} -p${password} --default-character-set=utf8 --skip-lock-tables \
--comments=FALSE --tables --no-create-info=FALSE --add-drop-table=TRUE --no-data=FALSE \
${area} | sed 's/AUTO_INCREMENT=[0-9]*\s//g' >${dest_dir}/`date +%F`_${area}.sql
echo "`date +%F_%R`: [INFO] Now the `date +%F`_${area}.sql have been backuped" >> /var/log/mysql_back.log
done
cd ${dest_dir} && tar czvf `date +%F`_sql.tar.gz `date +%F`_*.sql && rm -rf ${dest_dir}/`date +%F`_*.sql
}
function load_db(){
#usage:load_db 2017-05-23
time_want=$1
mysql -h${ipaddr} -u${username} -p${password} --default-character-set=utf8 --execute="DROP DATABASE IF EXISTS  ${area}";
mysql -h${ipaddr} -u${username} -p${password} --default-character-set=utf8 --execute="CREATE DATABASE IF NOT EXISTS  ${area} DEFAULT CHARACTER SET utf8";
mysql -h${ipaddr} -u${username} -p${password} --default-character-set=utf8 --database= ${area} <${dest_dir}/${time_want}_${area}.sql;
}
function upload_s3(){
ls
aws s3  cp ${dest_dir}/`date +%F`_sql.tar.gz  s3://backup-205/bigdata-mysql-jump/
aws s3  rm  s3://backup-205/bigdata-mysql-jump/`date +%F -d "10 days ago"`_sql.tar.gz
}
dump_db
upload_s3
