
function check_limit(){
cmd1='ulimit -n'
printf "sys_limit:\t `${cmd1}`\n"
if command -v supervisorctl > /dev/null 2>&1;then
  cmd2=$(cat /proc/$(ps axu |grep supervisord |grep -v grep |awk '{print $2}')/limits |grep "Max open files"|awk '{print $4}')
  printf "supervisord_limit:\t ${cmd2}\n"
elif [ `netstat -lntp | grep 16379 |wc -l` -ge 1 ] ;then
  cmd3=$(cat /proc/$(ps axu |grep ardb |grep -v grep |awk "{print \$2}")/limits |grep "Max open files"|awk "{print \$4}")
  printf "ardb_limit:\t ${cmd3}\n"
fi
}

function modify_limit(){

}
