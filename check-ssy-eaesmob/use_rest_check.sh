#!/bin/bash
##################################################
#Author: arvon
#Mail: guoyf@easemob.com
#Date: 16/06/21
#Todo: check message and user status
#Version: 1.0
##################################################
#----vars----
AppServer='a1.ssy.muper.net'
EjaServer='im-api.ssy.muper.net'
AppKey='mena/chat'
GroupKey='mena/chat'
UserName='201'
Passwd='666666'
TestToken='YWMtdHF5ZjkPEeaZH9-s2kRhBgAAAVaxCDxyMZEAPTbkifnO9n3h-QPEDBgBq7w'
#---local vars for module token---
UserNameToken='admin'
UserNamePass='Easemob2015'
#---Scripts---
case "$1" in
"token" )
#echo "Now take token"
curl -X POST -i  "http://${AppServer}/management/token" -d '{"grant_type":"password","username":"'${UserNameToken}'","password":"'${UserNamePass}'"}'
echo "\n"
;;
"create-user" )
#echo "Now take token"
curl -X POST -i  "http://${AppServer}/${AppKey}/users" -d '{"username":"'${UserName}'","password":"'${Passwd}'"}' -H "Authorization:Bearer ${TestToken}"
echo "\n"
;;

"status" )
#echo "Now check status"
curl -XGET "http://${AppServer}/${AppKey}/users/${UserName}/status" -H "Authorization:Bearer ${TestToken}"
echo "\n"
;;
"users" )
#echo "Now check users"
curl -XGET "http://${AppServer}/${AppKey}/users?limit=200" -H "Authorization:Bearer ${TestToken}"
echo "\n"
;;
"count" )
#echo "Now count messages"
if [ $# -eq 1 ];then
read -p "Input EjaToken:" GomeToken
curl -i -X GET -H "Authorization: Bearer ${GomeToken}" "http://${EjaServer}/api/easemob.com/${AppKey}/users/${UserName}/messages/count"
echo "\n"
else
echo "Usage: $0 count Gome'sToken"
fi
;;
"check-group" )
if [ $# -eq 2 ];then
  curl -X GET -H "Authorization: Bearer ${TestToken}"  -i  "http://${AppServer}/${GroupKey}/chatgroups/$2"
  echo "\n"
else
  echo "Usage: $0 group GroupID"  
fi
;;
"create-group" )
if [ $# -eq 2 ];then
  curl -X POST 'http://'${AppServer}'/'${AppKey}'/chatgroups' -H 'Authorization: Bearer '${TestToken}'' -d '{"groupname":"'$2'","desc":"server create group","public":true,"approval":true,"owner":"'${UserName}'","maxusers":300,"members":["'${UserName}'"]}'
else
  echo "Usage: $0 group GroupName"
fi
;;
"chat" )
#echo "Now chat to Offline User"
if [ $# -eq 2 ];then
SentMes=$2
curl -XPOST "http://${AppServer}/${AppKey}/message" -d '{"target_type" : "users","target" : ["'${UserName}'"],"msg" : {"type" : "txt","msg" : "'${SentMes}'"},"from" : "admin"}' -H "Authorization:Bearer ${TestToken}"
echo "\n"
else
echo "Usage: $0 chat your_message"
fi
;;
* )
echo "Usage: $0 {token|status|users|count|chat|check-group|create-group}"
exit 2
;;
esac
