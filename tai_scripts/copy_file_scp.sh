server_list="
ID,0.0.0.6
ID,0.0.0.9
"
new_server="
001,5.2.2.9
005,5.2.2.7
008,5.0.2.2
"
#mkdir ./tmp
for o_each_server in ${server_list};do
#    echo $o_each_server
    old_each_server=${o_each_server##*,}
    old_each_shard=${o_each_server%,*}
    echo $old_each_server
#    echo $old_each_shard
    All_shard=`ssh -o StrictHostKeyChecking=no -i Yourkey  ${old_each_server} 'cat /etc/ansible/facts.d/dev_gamex.fact|egrep  -A1000 \"shards\" |egrep -o "[0-9]{4}"'`
#    echo $All_shard
    for each_shard in ${All_shard};do
        echo $each_shard
#        scp -i Yourkey ${old_each_server}:/opt/supervisor/log/134_13013400${each_shard}_event_currency_2017-04-26.log ./tmp
#        scp -i Yourkey ${old_each_server}:/opt/supervisor/log/134_13013400${each_shard}_event_2017-04-26.log ./tmp
#        scp -i Yourkey ${old_each_server}:/opt/supervisor/log/logics_shard${each_shard}.26.04.2017.log ./tmp
        for new_sid in ${new_server};do
            if [ ${old_each_shard} == ${new_sid%,*} ];then
                echo "scp -i Yourkey ./tmp/134_13013400${each_shard}_event_currency_2017-04-26.log  ec2-user@${new_sid##*,}:/tmp"
                scp -i Yourkey ./tmp/134_13013400${each_shard}_event_currency_2017-04-26.log  ec2-user@${new_sid##*,}:/tmp
                echo "scp -i Yourkey ./tmp/134_13013400${each_shard}_event_2017-04-26.log  ec2-user@${new_sid##*,}:/tmp"
                scp -i Yourkey ./tmp/134_13013400${each_shard}_event_2017-04-26.log  ec2-user@${new_sid##*,}:/tmp
                echo "scp -i Yourkey ./tmp/logics_shard${each_shard}.26.04.2017.log  ec2-user@${new_sid##*,}:/tmp"
                scp -i Yourkey ./tmp/logics_shard${each_shard}.26.04.2017.log  ec2-user@${new_sid##*,}:/tmp
            fi
        done
    done
done
