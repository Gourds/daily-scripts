#!/usr/bin/sh
###############################################################################
#Author: arvon
#Email: yafeng2011@126.com 
#Blog: http://arvon.top/
#Date: 2016/08/08
#Filename: write_authorized_keys.sh
#Revision: 1.0
#License: GPL
#Description: auto write authorized to other server 
#Notes:
###############################################################################
#vars
username='root'
server_passwd='arvon2014'
IP_list="
172.17.18.61
172.17.18.62
172.17.18.63
"
functions
function Main(){
install_expect_package
create_ras_pub
write_authorized_file
}
#install expect package
function install_expect_package(){
yum install -y expect expect-devel
}
function create_rsa_pub(){
expect -c "
spawn ssh-keygen -t rsa
  expect {
    \"*y/n*\" {send \"y\r\"; exp_continue}
    \"*key*\" {send \"\r\"; exp_continue}
    \"*passphrase*\" {send \"\r\"; exp_continue}
    \"*again*\" {send \"\r\";}
  }"
}
function write_authorized_file(){
for each_ip in ${IP_list};do
    expect -c "  
    spawn ssh-copy-id ${username}@${each_ip}  
      expect {  
        \"*yes/no*\" {send \"yes\r\"; exp_continue}  
        \"*password*\" {send \"${server_passwd}\r\"; exp_continue}  
        \"*Password*\" {send \"${server_passwd}\r\";}  
      }  
    "  
done
}
#Main
Main
