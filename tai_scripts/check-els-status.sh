#/bin/sh

server_dict=(
[65]="10.33.3.65"
[31]="10.33.3.31"
[66]="10.33.3.66"
[64]="10.33.3.64"
[87]="10.33.3.87"
[88]="10.33.3.88"
[89]="10.33.3.89"
[90]="10.33.3.90"
[91]="10.33.3.91"
)

function all_status(){
for key in $(echo ${server_dict[*]});do
    curl $key:9200/_cat/health?v
done
}
if [ $# == 2 ];then
    if [ $2 == 'status' ];then
        curl ${server_dict[$1]}:9200/_cat/health?v
    fi
else
    if [ $1 == 'all' ];then
        all_status
    else
        ssh -i AWSYingxiong.pem  ec2-user@${server_dict[$1]}
    fi
fi
