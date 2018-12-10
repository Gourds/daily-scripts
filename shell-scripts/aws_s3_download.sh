m_time=$1
f_time=${m_time//-/}

save_dir='./path/'



function down_hmt(){
  m_region='xxx'
  dynamo_bak_dir='backup-xxx/dynamodb/'
  types="Devices_xxx/
         Name_xxx/
         QuickPay_xxx/
         UserInfo_xxx/
         UserShardInfo_xxx/"
  for each_type in $types;do
      s1=`aws --region ${m_region} s3 ls s3://${dynamo_bak_dir}${each_type} \
          | grep ${f_time} |awk '{print $2}'`
      aws --region ${m_region} s3 cp \
      s3://${dynamo_bak_dir}${each_type}${s1}  \
      ${save_dir}backup-205/${m_time}/dynamodb/${each_type} \
      --exclude '"*"' --include '"*"' \
      --recursive
  done
}


down_hmt
