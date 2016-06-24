#!/bin/bash
####################################################
#Author: arvon
#Mail: yafeng2011@126.com
#Date: 16/06/24
#Version: 1.0
#Todo: find somefile or character
###################################################

#---Var---
find_path="$2"
find_pattern="$3"

#---Health Check---
if [ $# -ne 3 ];then
  echo "Please check you argument, This scripts need 3 argument"
  exit 3
fi

#---Main script---
case "$1" in
--name|-n )
#the base find type
find ${find_path} -name ${find_pattern}
;;
--time|-t )
#-mtime -3(0~72h) is in three days,+(>72h)is more than three days
find ${find_path} -mtime ${find_pattern} -type f -print
;;
--size|-s )
#Default is find the size in MB
find ${find_path} -size ${find_pattern}M
;;
--word|-w )
#Default is ignore case sensitivity and display line number and file name
find ${find_path} -type f |xargs grep -n -i --color=auto ${find_pattern}
;;
* )
echo "Usage: $0 {name|time|size|word PATH PATTERN}"
;;
esac
