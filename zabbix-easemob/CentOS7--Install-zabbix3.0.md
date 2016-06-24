CentOS7--Install-zabbix3.0
---
### Command record
* Yum Repo Install
``` shell
#The system Version is CentOS7.2
wget http://repo.zabbix.com/zabbix/3.0/rhel/7/x86_64/zabbix-release-3.0-1.el7.noarch.rpm
rpm -ivh  zabbix-release-3.0-1.el6.noarch.rpm 
```

* LAMP Environment
	* Warning
``` shell
#iptables
systemctl stop iptables
#selinux
setenforce 0
```
``` shell
yum install mysql mysql-server php php-mysql httpd 
#Installed:
#  mysql-community-client.x86_64 0:5.6.30-2.el6       mysql-community-libs.x86_64 0:5.6.30-2.el6       mysql-community-server.x86_64 0:5.6.30-2.el6       nginx.x86_64 1:1.6.3-8.el7       php.x86_64 0:5.4.16-36.1.el7_2.1       php-mysql.x86_64 0:5.4.16-36.1.el7_2.1      
/etc/init.d/mysqld start
mysqladmin password
mysql -uroot -padmin -e "create database zabbix character set utf8;"
mysql -uroot -padmin -e "grant all privileges on zabbix.* to zabbix@localhost identified by 'zabbix';"
mysql -uroot -padmin -e "flush privileges;"
#mysql -h$zabbixIP -uzabbix -pzabbix
systemctl start httpd
systemctl status httpd
```
#### Zabbix Server
* Zabbix Server Install
``` shell
yum -y install zabbix-server-mysql zabbix-web-mysql zabbix-get
#Installed:
#  zabbix-get.x86_64 0:3.0.3-1.el7                                                     zabbix-server-mysql.x86_64 0:3.0.3-1.el7                                                     zabbix-web-mysql.noarch 0:3.0.3-1.el7                
cd /usr/share/doc/zabbix-server-mysql-3.0.3/
zcat create.sql.gz | mysql -uroot -padmin zabbix
```
* Zabbix Modify config
	* zabbix_server.conf
``` shell
#cat /etc/zabbix/zabbix_server.conf | egrep -v "^#|^$"
LogFile=/var/log/zabbix/zabbix_server.log
LogFileSize=0
PidFile=/var/run/zabbix/zabbix_server.pid
DBHost=localhost
DBName=zabbix
DBUser=zabbix
DBPassword=zabbix
SNMPTrapperFile=/var/log/snmptrap/snmptrap.log
Timeout=4
AlertScriptsPath=/usr/lib/zabbix/alertscripts
ExternalScripts=/usr/lib/zabbix/externalscripts
LogSlowQueries=3000
```
	* zabbix_
``` shell
#vim /etc/httpd/conf.d/zabbix.conf 
	<IfModule mod_php5.c>
        php_value max_execution_time 300
        php_value memory_limit 128M
        php_value post_max_size 16M
        php_value upload_max_filesize 2M
        php_value max_input_time 300
        php_value always_populate_raw_post_data -1
        php_value date.timezone Asia/Chongqing
    </IfModule>

```	

* Start Zabbix
``` shell
systemctl enable zabbix-server
systemctl start zabbix-server

```
* Zabbix Web Install
``` shell
#Use Web Access: http://$IPADDRESS/zabbix/setup.php
#Mdodify Parameter Base： https://www.zabbix.com/documentation/3.0/manual/installation/install_from_packages
#The web Default Name/Password is Admin/zabbix
```

#### Zabbix Agent
* Install
``` shell
yum install zabbix zabbix-agent
```
* Modify config
``` shell
PidFile=/var/run/zabbix/zabbix_agentd.pid
LogFile=/var/log/zabbix/zabbix_agentd.log
LogFileSize=0
Server=127.0.0.1,172.17.18.64	#Add the agent IP
ServerActive=172.17.18.64	#Modify
Hostname=Zabbix server
Include=/etc/zabbix/zabbix_agentd.d/
```



