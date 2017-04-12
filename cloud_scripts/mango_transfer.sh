#!/bin/bash

#vars
username_mon='mongouser'
password_mon='33333'
address_mon='1.1.1.1:27017'

all_dbnames=`echo "show dbs"|mongo -u ${username_mon} -p ${password_mon} --host ${address_mon} admin --shell  -quiet |egrep -v 'for help|admin|local' |awk '{print $1}'`
#echo  $all_dbnames
for each_dbname in ${all_dbnames};do
    all_colls=`echo "show collections" |mongo ${address_mon}/${each_dbname} -u ${username_mon} -p ${password_mon} --authenticationDatabase=admin --shell -quiet |egrep -v 'for help|system.indexes'`
#    echo "echo "show collections" |mongo ${address_mon}/${each_dbname} -u ${username_mon} -p ${password_mon} --authenticationDatabase=admin --shell -quiet "
    echo $all_colls
    for each_coll in ${all_colls};do
#        echo $each_coll
        mongoexport -u ${username_mon} -p ${password_mon} --authenticationDatabase=admin --db ${each_dbname} --collection ${each_coll} --out json/${each_dbname}_${each_coll}.json --jsonArray --host ${address_mon}
###        echo "        mongoexport -u ${username_mon} -p ${password_mon} --authenticationDatabase=admin --db ${each_dbname} --collection ${each_coll} --out json/${each_dbname}_${each_coll}.json --jsonArray --host ${address_mon}"
    done
done
