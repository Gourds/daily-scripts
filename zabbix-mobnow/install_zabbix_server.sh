#!/bin/bash
######################################################################
#Author: arvon
#Emaile: guoyf@easemob.com
#Date: 2015/06/06
#Version: 1.0
#Todo: install zabbix server for centOS 7.2 should use root
######################################################################

#-----Vars-----
zabbix_log_file=arvon_zabbix_install_log
mysql_root_password=admin
zabbix_db_password=zabbix

#-----Main-----
function Main(){
clean_log
#check_yum_repo
#check_iptables
#install_LAMP_package
#init_mysql
#zabbix_mysql_init
#install_zabbix_server
#modify_zabbix_server_config
modify_zabbix_conf
#start_zabbix_server
restart_apache
#check_zabbix_status
}

#-----Functions---
function clean_log(){
echo "Now clean the log file" >> ${zabbix_log_file}
echo > ${zabbix_log_file}
}

function check_yum_repo(){
echo "The yum repo now is `ls /etc/yum.repos.d`"
echo "The yum repo now is `ls /etc/yum.repos.d`" >> ${zabbix_log_file}
yum install axel -y >> ${zabbix_log_file} 2>&1
# the package axel is the command wget
echo "Download the yum repo file for zabbix-server..."
echo "Download the yum repo file for zabbix-server..." >> ${zabbix_log_file}
axel http://repo.zabbix.com/zabbix/3.0/rhel/7/x86_64/zabbix-release-3.0-1.el7.noarch.rpm >> ${zabbix_log_file} 2>&1
#axel https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm >> ${zabbix_log_file} 2>&1
echo "Install the yum repo for zabbix-server..."
echo "Install the yum repo for zabbix-server..." >> ${zabbix_log_file}
rpm -ivh  zabbix-release-3.0-1.el7.noarch.rpm >> ${zabbix_log_file} 2>&1
#rpm -ivh epel-release-latest-7.noarch.rpm >> ${zabbix_log_file} 2>&1
}

function check_iptables(){
echo "now check iptabels and selinux..."
echo "now check iptabels and selinux..." >> ${zabbix_log_file}
systemctl stop iptables >> ${zabbix_log_file} 2>&1
setenforce 0 >> ${zabbix_log_file} 2>&1
}

function install_LAMP_package(){
echo "Install package for LAMP incloud(mysql/mysql-server/php/php-mysql/httpd)..."
echo "Install package for LAMP incloud(mysql/mysql-server/php/php-mysql/httpd)..." >> ${zabbix_log_file}
yum install mysql mysql-server php php-mysql httpd -y >> ${zabbix_log_file} 2>&1
}

function init_mysql(){
echo "Now setup mysql root password and start mysql service..."
echo "Now setup mysql root password and start mysql service..." >> ${zabbix_log_file}
/etc/init.d/mysqld start >> ${zabbix_log_file} 2>&1
mysqladmin -uroot password ${mysql_root_password} >> ${zabbix_log_file} 2>&1
}

function zabbix_mysql_init(){
echo "now create zabbix database and zabbix user..."
echo "now create zabbix database and zabbix user..." >> ${zabbix_log_file}
mysql -uroot -p${mysql_root_password} -e "create database zabbix character set utf8;" >> ${zabbix_log_file} 2>&1
mysql -uroot -p${mysql_root_password} -e "grant all privileges on zabbix.* to zabbix@localhost identified by 'zabbix';" >> ${zabbix_log_file} 2>&1
mysql -uroot -p${mysql_root_password} -e "flush privileges;" >> ${zabbix_log_file} 2>&1
}

function install_zabbix_server(){
echo "Now install zabbix server package..."
echo "Now install zabbix server package..." >> ${zabbix_log_file}
yum -y install zabbix-server-mysql zabbix-web-mysql zabbix-get -y >> ${zabbix_log_file} 2>&1
cd /usr/share/doc/zabbix-server-mysql-3.0.3/
zcat create.sql.gz | mysql -uroot -padmin zabbix
}

function modify_zabbix_server_config(){
echo "Modefy zabbix server's config..."
echo "Modefy zabbix server's config..." >> ${zabbix_log_file}
sed -i 's/.*DBHost=.*/DBHost=localhost/' /etc/zabbix/zabbix_server.conf; >/dev/null
sed -i 's/.*DBName=.*/DBName=zabbix/' /etc/zabbix/zabbix_server.conf; >/dev/null
sed -i 's/.*DBUser=.*/DBUser=zabbix/' /etc/zabbix/zabbix_server.conf; >/dev/null
sed -i "s/.*DBPassword=.*/DBPassword=${zabbix_db_password}/" /etc/zabbix/zabbix_server.conf; >/dev/null
}

function modify_zabbix_conf(){
sed -i "s#.*php_value date.timezone.*#\tphp_value date.timezone Asia/Chongqing#" /etc/httpd/conf.d/zabbix.conf >/dev/null
}

function start_zabbix_server(){
echo "Start zabbix Server..."
echo "Start zabbix Server..." >> ${zabbix_log_file}
systemctl enable zabbix-server > /dev/null
systemctl start zabbix-server >> ${zabbix_log_file} 2>&1
}

function restart_apache(){
systemctl restart httpd > /dev/null
}

function check_zabbix_status(){
echo "Zabbix server status is: `systemctl status zabbix-server | grep Active`"
echo "Httpd server status is: `systemctl status httpd | grep Active`"
ss -lnt | grep 10051
ss -lnt | grep 80
}
#-----Scripts -----
Main
