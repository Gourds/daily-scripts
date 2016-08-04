#!/bin/sh
###################################################################
#Author: arvon
#Mail: guoyf@easemob.com
#date: 16/06/27
#Version: 1.0
#Todo: write the ip-list to playbooks inventory file
###################################################################
#
#---Vars---
inventory_path='/data/ps/ops-repo'
inventory_list='/data/ps/ops-repo/inventory/ssy/inventory-list.yml'
host_name='ssy'

#---Functions Main and Debug---
function Main (){
init_list
write_cassandra
write_redis
write_zookeeper
write_kafka
write_mysql
write_rest
write_thrift
write_push
write_ejabberd
write_msync
write_web
write_turnserver
write_media
write_conference
del_blank_lines
}

#---functions Detail---
function init_list (){
cp ${inventory_list} /tmp
echo > ${inventory_list} 
echo '''
hosts_ops_path: '${inventory_path}'
inventory:
  name: '${host_name}'
  hosts:
''' >> ${inventory_list}
}
function write_cassandra (){
read -p "Cassandra Num: " cassandra_num
for cn in `seq 1 ${cassandra_num}`;do
  read -p "ssy-db${cn} IP: " cass_ip
  echo '''
  - name: ssy-db'${cn}'
    ip: '${cass_ip}'
    group: dbservers
       '''>> ${inventory_list}
done 
}
function write_redis (){
read -p "Redis Num: " redis_num
for rn in `seq 1 ${redis_num}`;do
  read -p "ssy-redis${rn} IP: " redis_ip
  echo '''
  - name: ssy-redis'${rn}'
    ip: '${redis_ip}'
    group: redis
       '''>> ${inventory_list}  
done
}
function write_zookeeper (){
read -p "Zookeeper Num: " zook_num
for zn in `seq 1 ${zook_num}`;do
  read -p "ssy-zk${zn} IP: " zook_ip
  echo '''
  - name: ssy-zk'${zn}'
    ip: '${zook_ip}'
    group: zookeeper
      '''>>${inventory_list}
done
}
function write_kafka (){
read -p "Kafka Num: " kafka_num
for kn in `seq 1 ${kafka_num}`;do
  read -p "ssy-kafka${kn} IP: " kafka_ip
  echo '''
  - name: ssy-kafak'${kn}'
    ip: '${kafka_ip}'
    group: kafka
       '''>>${inventory_list}
done
}
function write_mysql (){
read -p "Mysql Num: " mysql_num
for mn in `seq 1 ${mysql_num}`;do
 read -p "ssy-mysql${mn} IP: " mysql_ip
 echo '''
 - name: ssy-mysql'${mn}'
   ip: '${mysql_ip}'
   group: mysql
      '''>>${inventory_list}
done
}
function write_rest (){
read -p "Easemob-rest Num: " rest_num
for ren in `seq 1 ${rest_num}`;do
  read -p "ssy-rest${ren} IP: " rest_ip
  echo '''
  - name: ssy-rest'${mn}'
    ip: '${rest_ip}'
    group: rest
       '''>>${inventory_list}
done
}
function write_thrift (){
read -p "Easemob-thrift Num: " thrift_num
for tn in `seq 1 ${thrift_num}`;do
  read -p "ssy-thrift${tn} IP: " thrift_ip
  echo '''
  - name: ssy-thrift'${tn}'
    ip: '${thrift_ip}'
    group: thrift
       '''>>${inventory_list}
done
}
function write_push (){
read -p "Easemob-push Num: " push_num
for pn in `seq 1 ${push_num}`;do
  read -p "ssy-push${pn} IP: " push_ip
  echo '''
  - name: ssy-push'${pn}'
    ip: '${push_ip}'
    group: push
       '''>>${inventory_list}
done
}
function write_ejabberd (){
read -p "Ejabberd Num: " eja_num
for ejn in `seq 1 ${eja_num}`;do
  read -p "ssy-ejabberd${ejn} IP: " eja_ip
  read -p "Roles db/conn: "  eja_group_type 
  echo '''
  - name: ssy-ejabberd'${ejn}'
    ip: '${eja_ip}'
    group: ejabberd_'${eja_group_type}'
       '''>>${inventory_list}
done
echo '''
  - name: ejabberd_conn
    ip: '#'
    group: ejabberd:children

  - name: ejabberd_db
    ip: '#'
    group: ejabberd:children
       ''' >>${inventory_list}
}
function write_msync (){
read -p "Msync Num: " msync_num
for msn in `seq 1 ${msync_num}`;do
  read -p "ssy-msync${msn} IP: " msync_ip
  echo '''
  - name: ssy-msync'${msn}'
    ip: '${msync_ip}'
    group: msync
       '''>>${inventory_list}
done
}
function write_web (){
read -p "Web Num: " web_num
for wn in `seq 1 ${web_num}`;do
  read -p "ssy-web${wn} IP: " web_ip
  echo '''
  - name: ssy-web'${wn}'
    ip: '${web_ip}'
    group: web
       '''>>${inventory_list}
done
}
function write_turnserver (){
read -p "TurnServer Num: " turn_num
for tum in `seq 1 ${turn_num}`;do
  read -p "ssy-turn${tum} IP: " turn_ip
  echo '''
  - name: ssy-turn'${tum}'
    ip: '${turn_ip}'
    group: turn
       '''>>${inventory_list}
done
}
function write_media (){
read -p "Media Num: " media_num
for men in `seq 1 ${media_num}`;do
  read -p "ssy-meida${men} IP: " media_ip
  echo '''
  - name: ssy-meida'${men}'
    ip: '${media_ip}'
    group: meida
       '''>>${inventory_list}
done
}
function write_conference (){
read -p "Conference Num: " conference_num
for con in `seq ${conference_num}`;do
  read -p "ssy-conference${con} IP: " conference_ip
  echo '''
  - name: ssy-conference'${con}'
    ip: '${conference_ip}'
    group: conference
      '''>>${inventory_list}
done
}
function del_blank_lines() {
sed -i -e '/^$/d' ${inventory_list} 
}
#---Main---
Main
