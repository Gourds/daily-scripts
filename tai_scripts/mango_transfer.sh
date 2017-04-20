#!/usr/bin/sh
###############################################################################
#Author: arvon
#Email:arvon2014@gmail.com
#Blog: http://blog.arvon.top/
#Date: 2017-04-20
#Filename: mango_transfer.sh
#Revision: 1.0
#License: GPL
#Description: use mango export tools export mango data
#Notes:
###############################################################################

#vars
username_mon='xxxx'
password_mon='xxxx'
address_mon='xx.xx.xx.xx:port'
mongo_tools_dir='./'
export_dir='./json'

all_dbnames=`echo "show dbs"|mongo -u ${username_mon} -p ${password_mon} --host ${address_mon} admin --shell  -quiet |egrep -v 'for help|admin|local' |awk '{print $1}'`

#functions
function Main(){
install_mango_tools
export_mango_data
}
function install_mango_tools(){
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.0.13.tgz
tar -zxvf mongodb-linux-x86_64-3.0.13.tgz
cd ${mongo_tools_dir}
base_dir=`pwd`
mkdir -p mongodb
cp -R -n mongodb-linux-x86_64-3.0.13/ mongodb
export_dir=${base_dir}/mongodb/mongodb-linux-x86_64-3.0.13/bin
export PATH=${export_dir}:$PATH
}
function export_mango_data(){
for each_dbname in ${all_dbnames};do
    all_colls=`echo "show collections" |mongo ${address_mon}/${each_dbname} -u ${username_mon} -p ${password_mon} --authenticationDatabase=admin --shell -quiet |egrep -v 'for help|system.indexes'`
    for each_coll in ${all_colls};do
        echo "Now is export ${each_coll} ..."
        mongoexport -u ${username_mon} -p ${password_mon} --authenticationDatabase=admin --db ${each_dbname} --collection ${each_coll} --out ${export_dir}/${each_coll}.json --jsonArray --host ${address_mon}
    done
done
}
Main
