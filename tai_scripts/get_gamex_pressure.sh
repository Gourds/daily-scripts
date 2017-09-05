#!/bin/bash

shardid=$1
result_dir="gamex_${shardid}_`date +%Y%m%d%M%S`"
function check_go_env(){
if command -v go >/dev/null 2>&1; then
  echo 'exists go'
else
  echo 'no exists go,now install it'
  yum install golang.x86_64 graphviz -y
fi
}
function run_dev_command(){
if [ -d ${result_dir} ];then
  rm -rf ${result_dir%_*}
  mkdir -p /tmp/${result_dir}
else
  mkdir -p /tmp/${result_dir}
fi
cd /opt/supervisor/gamex-shard${shardid}/
server_port=`cat pprof`
go tool pprof -svg gamex http://127.0.0.1${server_port}/debug/pprof/heap?debug=1 > /tmp/${result_dir}/gamexmem.svg 2> /tmp/${result_dir}/error.log
go tool pprof -svg gamex http://127.0.0.1${server_port}/debug/pprof/block > /tmp/${result_dir}/gamexblock.svg 2> /tmp/${result_dir}/error.log
go tool pprof -svg gamex http://127.0.0.1${server_port}/debug/pprof/goroutine > /tmp/${result_dir}/gamexgor.svg 2> /tmp/${result_dir}/error.log
go tool pprof -svg gamex http://127.0.0.1${server_port}/debug/pprof/profile > /tmp/${result_dir}/gamexprofile.svg 2> /tmp/${result_dir}/error.log
echo "The command: get gamex pressure running over!"
}

function compress_result(){
cd /tmp/
rm -rf *._safe.tar.gz
tar czvf ${result_dir}_safe.tar.gz ${result_dir}
}

if [ $# != 1 ];then
  echo "Usage: $0 shardid"
else
  check_go_env
  run_dev_command
  compress_result
fi
