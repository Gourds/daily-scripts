#!/bin/bash

if [ -f /data/mysql_import/sql_imported ]
then
   echo "The sql files was imported"
   exit 0
else
   mysql -u {{im_mysql.username}} -p {{im_mysql.password}} -h {{im_mysql.server}} ejabberd < /data/mysql_import/mysql_ejabberd.sql
   mysql -u {{im_mysql.username}} -p {{im_mysql.password}} -h {{im_mysql.server}} ejabberd < /data/mysql_import/mysql_log.sql
   touch /data/mysql_import/sql_imported
   rm /data/mysql_import/mysql_ejabberd.sql
   rm /data/mysql_import/mysql_log.sql
fi
