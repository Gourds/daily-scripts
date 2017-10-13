#!/usr/bin/sh
###############################################################################
#Author: arvon
#Email: yafeng2011@126.com 
#Blog: http://arvon.top/
#Date: 2016/08/08
#Filename: write_authorized_keys.sh
#Revision: 2.0
#License: GPL
#Description: auto write authorized to other server 
#Notes:
###############################################################################
#vars
username='root'
server_passwd='easemob2015'
server_info_file='./server_info_list.txt'
IP_list="
172.17.201.81
172.17.201.82
172.17.201.83
172.17.201.84
"
#functions
function Main(){
#install_expect_package
#create_rsa_pub
#write_authorized_file
get_server_info
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
function get_server_info(){
echo -e "Now is printing server's information\n..."
printf "%-15s %-15s %-15s %-10s %-10s %-10s %-10s\n" OS IP-in IP-out CPU-num MEM-all MEM-free NET-status > ${server_info_file}
for each_host in ${IP_list};do
    #s_addr_eth0=`ssh root@${each_host} "ifconfig eth0 | awk '/inet addr:/{ print $2 }' |  awk -F: '{print $2 }'"`
    s_os_release=`ssh root@${each_host} "cat /etc/redhat-release"|sed 's/.*release/release/g' |awk '{print $2}'`
    s_addr_eth0=`ssh root@${each_host} "ip addr | grep eth0 | grep inet"|awk '{print $2}' |awk -F/ '{print $1}'`
    s_addr_pub=`ssh root@${each_host} "ip addr | grep eth0 | grep inet"|awk '{print $2}' |awk -F/ '{print $1}'`
    s_cpu_core=`ssh root@${each_host} "cat /proc/cpuinfo |grep processor"|wc -l`
    s_mem_total=`ssh root@${each_host} "free -m | grep Mem" |awk '{print \$2}'`
    s_mem_use=`ssh root@${each_host} "free -m | grep Mem" |awk '{print $4}'`
    if [ `ssh root@${each_host} "ping -c5 -q www.baidu.com 2>&1" |grep received |awk -F, '{print $2}' |awk '{print $1}'` -ge 3 ] >/dev/null 2>&1;then net_status='yes' ;else net_status='no' ;fi
    s_net_status=$net_status
    printf "%-15s %-15s %-15s %-10s %-10s %-10s %-10s\n" ${s_os_release:Null} ${s_addr_eth0:Null} ${s_addr_pub:Null} ${s_cpu_core:Null} ${s_mem_total:Null} ${s_mem_use:Null} ${s_net_status:Null} >> ${server_info_file}
done
echo "Now is Done,The result file path is ${server_info_file}"
}
#Main
Main
