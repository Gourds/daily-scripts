#!/bin/sh
#---------Ready----------------------
countFile=mserver_20160525.log
tmp_file_name=arvon_tmp_file
where_result=result_file_arvon

#---------Create new file------------
#cat ${countFile}|grep "delete conf info" |tr '[' '(' |tr ']' ')'|awk '{split($0,a,"[()]");print a[6],a[8],a[10],a[12],a[14],a[15];}' >> ${tmp_file_name}
all_apps=`cat ${tmp_file_name}|awk '{print $1}' |cut -d'#' -f2 |cut -d'_' -f1|sort |uniq -c |sort -n -r |awk '{print $2}'`
#echo "all_apps is ${all_apps}"
echo "##Follow's Datas is from ${countFile}"##### >> ${where_result}
echo "###########################################"  >> ${where_result}

#---------Go------------------------
for each_app in ${all_apps};do
#    echo $each_app
        total_up_media=0
        total_success_up_media=0
        total_secouds=0
        total_up_bytes=0
        total_down_bytes=0
    while read all_vars;do
#        echo "all_vars=${all_vars}"
        each_all_app=`echo ${all_vars} |awk '{print $1}' |cut -d'#' -f2 |cut -d'_' -f1`
#        echo "each_all_app=${each_all_app}"
        each_secoud=`echo ${all_vars} |awk '{print $2}'`
#        echo "each_secoud=${each_secoud}"
        test_success_up_media=`echo ${all_vars} |awk '{print $3}'`
#        echo "test_success_up_meida=${test_success_up_meida}"
        each_up_bytes=`echo ${all_vars} |awk '{print $4}'`
#        echo "each_up_bytes=${each_up_bytes}"
        each_down_bytes=`echo ${all_vars} |awk '{print $5}'`
#        echo "each_down_bytes=${each_down_bytes}"
        if [ ${each_all_app}  == $each_app ];then
            ((total_up_media=${total_up_media}+1))
            ((total_secouds=${each_secoud}+${total_secouds}))
            ((total_up_bytes=${each_up_bytes}+${total_up_bytes}))
            ((total_down_bytes=${each_down_bytes}+${total_down_bytes}))
            if [ ${test_success_up_media} -ne 0 ];then
                ((total_success_up_media=${total_success_up_media}+1))
            fi
#-----------Acceleration-----
#            sed -i -e "/${each_app}/d" ${tmp_file_name}
        fi        
    done < ${tmp_file_name}

#--------debug---------------
#        echo "the ${each_app} have ${total_up_media} lines"
#        echo "the ${each_app} have ${total_success_up_media} lines"
#        echo "the ${each_app} total have ${total_up_media} and success ${total_success_up_media}"
#        echo "the ${each_app} have ${total_secouds} secouds"
#        echo "the ${each_app} have ${total_up_bytes} bytes"
#        echo "the ${each_app} have ${total_down_bytes} bytes"

#----Conversion of Units-----
        total_secouds=`echo "${total_secouds} / 60" |bc`
        total_up_bytes=`echo "${total_up_bytes} / 1000 / 1000" |bc`
        total_down_bytes=`echo "${total_down_bytes} / 1000 / 1000" |bc`

#---------Result-------------
        echo "App_name:${each_app}\t Total_secouds:${total_secouds} minutes\t Up_media(success/total):${total_success_up_media}/${total_up_media}\t Total_datas(up/down):${total_up_bytes}/${total_down_bytes} MB"
        echo "App_name:${each_app}\t Total_secouds:${total_secouds} minutes\t Up_media(success/total):${total_success_up_media}/${total_up_media}\t Total_datas(up/down):${total_up_bytes}/${total_down_bytes} MB" >> $where_result
done
#--------Delete the tmp file-
#rm -rf ${tmp_file_name}
#rm -rf ${tmp_file_name}-e
