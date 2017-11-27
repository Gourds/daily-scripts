# -*- coding:utf-8 -*-
###############################################################################
#Author: arvon
#Email: guoyafeng@taiyouxi.cn
#Date: 2017-11-27
#Filename: get_data_from_csv.py
#Revision: 1.0
#Description: Getting the specified data from Excel
#Notes:
###############################################################################
import sys
import datetime
from xlrd import open_workbook
from xlrd import xldate
#from xlrd import xldate_as_tuple
#The vars must be define before start
excel_file = './pay_new.xlsx'
want_time = datetime.datetime.now().strftime('%Y-%m-%d')
#want_time = sys.argv[1]
#define vars
data = open_workbook(excel_file)
table = data.sheets()[0]
#open the excel first sheets
def specify_date_data(day_ago):
    for each_day in range(0,int(day_ago)+1):
        fwant_day = datetime.datetime.now() - datetime.timedelta(days=each_day)
        mwant_day = fwant_day.strftime('%Y-%m-%d')
        for each_line_num in range(1,table.nrows):
            each_line = table.row_values(each_line_num)
        #    date_time = datetime.xldate_as_tuple(each_line[1],0)
            date_time = xldate.xldate_as_datetime(each_line[1],0)
            if str(mwant_day) in str(date_time):
                print 'Date: %s  %s:%s  %s:%s' %(str(mwant_day), table.cell(0, 2).value, each_line[2], table.cell(0, 3).value, each_line[3])

if __name__ == '__main__':
    specify_date_data(3)
