#!/bin/sh
#---------Ready----------------------
countFile=$1
if [ ! $1 ];then
    echo "No Argument!!! Please use like: $0 xxx.log"
    exit
fi
tmp_file_name=arvon_tmp_file
awk_file=tao_file.awk
where_result=result_file_arvon

#---------Create new file------------
if [ ! -e ${tmp_file_name} ];then
    #cat ${countFile}|grep "delete conf info" |tr '[' '(' |tr ']' ')'|awk '{split($0,a,"[()]");print a[6],a[8],a[10],a[12],a[14];}'| tr '#' ' ' | tr '_' ' '| awk '{print $2,$4,$5,$6,$7}' >> ${tmp_file_name}
    #cat ${countFile}|grep "delete conf info" |tr '[' '(' |tr ']' ')'|awk '{split($0,a,"[()]");print a[6],a[8],a[10],a[12],a[14];}'| tr '_' ' '| awk '{print $1,$3,$4,$5,$6}' >> ${tmp_file_name}
    cat ${countFile}|grep "delete conf info" |tr '[' '(' |tr ']' ')'|awk '{split($0,a,"[()]");print a[6],a[8],a[10],a[12],a[14];}'| sed 's/_/ /'| awk '{print $1,$3,$4,$5,$6}' >> ${tmp_file_name}
else
    rm -rf ${tmp_file_name}
    cat ${countFile}|grep "delete conf info" |tr '[' '(' |tr ']' ')'|awk '{split($0,a,"[()]");print a[6],a[8],a[10],a[12],a[14];}'| sed 's/_/ /'| awk '{print $1,$3,$4,$5,$6}' >> ${tmp_file_name}
fi
if [ ! -e ${awk_file} ];then
cat << EOF >> ${awk_file}
{count[\$1]+=1;
if (\$2 > 0) {
  succ[\$1]+=1;
}
a[\$1]+=\$2;
c[\$1]+=\$4;
d[\$1]+=\$5;
}
END {
for (i in a) {
    print "AppName:" i "\t" "TotalSecouds:"int(a[i]/60)"mins" "\t" "UpMedia(success/total):" succ[i] "/" count[i] "\t" "Total_up/down:" int(c[i]/1000/1000) "/" int(d[i]/1000/1000)"MB";
}
}
EOF
fi
#---------Debug------------
#awk '{a[$1]+=$2;b[$1]+=$3;c[$1]+=$4;d[$1]+=$5;}END{for (i in a){print i " " a[i] " "b[i] " " c[i] " " d[i];}}' aa
#awk '{total_secouds[$1]+=$2;total_up_bytes[$1]+=$4;total_down_bytes[$1]+=$5;}END{for (each_app in total_secouds){print each_app " " "total_secouds" total
#awk '{a[$1]+=$2;c[$1]+=$4;d[$1]+=$5;}END{for (i in a){print "AppName:" i "\t" "TotalSecouds:"int(a[i]/60)"mins" "\t" "Total_up/down:" int(c[i]/1000/1000) "/" int(d[i]/1000/1000)"MB";}}' ${tmp_file_name}
#awk '{a[$1]+=$2;c[$1]+=$4;d[$1]+=$5;}END{for (i in a){print "AppName:" i "\t" "TotalSecouds:"int(a[i]/60)"mins" "\t" "Total_up/down:" int(c[i]/1000/1000) "/" int(d[i]/1000/1000)"MB";}}' ${tmp_file_name} |awk '{printf "%-35s %-35s %-35s\n",$1,$2,$3}'|sort -k3 -r >> ${where_result}
#awk '{count[$1]+=1;if($2>0){succ[$1]+=1;};a[$1]+=$2;c[$1]+=$4;d[$1]+=$5;}END{for (i in a){print "AppName:" i "\t" "TotalSecouds:"int(a[i]/60)"mins" "\t" "UpMedia(success/total):" succ[i] "/" count[i] "\t" "Total_up/down:" int(c[i]/1000/1000) "/" int(d[i]/1000/1000)"MB";}}' ${tmp_file_name} |awk '{printf "%-35s %-35s %-35s %-35s\n",$1,$2,$3,$4}'

#--------Main-------------
if [ ! -e ${where_result} ];then
    awk -f ${awk_file} ${tmp_file_name} | awk '{printf "%-35s %-35s %-35s %-35s\n",$1,$2,$3,$4}'|sort -k3 -r >> ${where_result}
else
    mv ${where_result} ${where_result}_bak
    awk -f ${awk_file} ${tmp_file_name} | awk '{printf "%-35s %-35s %-35s %-35s\n",$1,$2,$3,$4}'|sort -k3 -r >> ${where_result}
fi
awk -f ${awk_file} ${tmp_file_name} | awk '{printf "%-35s %-35s %-35s %-35s\n",$1,$2,$3,$4}'
