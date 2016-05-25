#!/bin/bash

mysql -uroot << EOF
SET PASSWORD FOR root@'localhost'=PASSWORD('easemobmysqlroot');
SET PASSWORD FOR root@'127.0.0.1'=PASSWORD('easemobmysqlroot');
DELETE from mysql.user where password='';
flush privileges;
EOF

cat << EOF >> /root/.my.cnf
[client]
user=root
password=easemobmysqlroot
EOF

mysql << EOF
create database ejabberd character set utf8mb4;
SET old_passwords = 0;
create user 'ejabberd'@'%';
grant all privileges on ejabberd.* to 'ejabberd'@'%' IDENTIFIED by 'ejabberd';
flush privileges;
SET old_passwords = 1;
EOF
