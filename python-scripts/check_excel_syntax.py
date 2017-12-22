#!/usr/bin/python
#! --encoding=utf-8
import sys
import datetime
import re
from xlrd import open_workbook
from xlrd import xldate
from Tkinter import *
import tkMessageBox

#from xlrd import xldate_as_tuple
#The vars must be define before start
# #want_time = datetime.datetime.now().strftime('%Y-%m-%d')
class Application(Frame):
    def __init__(self, master=None):
        Frame.__init__(self, master)
        self.pack()
        self.createWidgets()

    def createWidgets(self):
        self.nameInput = Entry(self)
        self.nameInput.pack()
        self.alertButton = Button(self, text='Check', command=self.check_config)
        self.alertButton.pack()

    def check_config(self):
        excel_file = self.nameInput.get() or '/Users/arvon/tmp/check_excel/Code-20171220-1-HMT.xlsx'
        data = open_workbook(excel_file)
        table = data.sheets()[0]
        reload(sys)
        sys.setdefaultencoding("utf-8")
        result_list = []
        for each_title in range(0, table.ncols):
            m_title = str(table.cell(2, each_title)).decode("unicode_escape").encode("utf8")
            for each_line in range(4, table.nrows):
                if '时间' in m_title:
                    if (table.cell(each_line, each_title).ctype == 3):
                        # ctype : 0 empty,1 string, 2 number, 3 date, 4 boolean, 5 error
                        result_list.append("%s %s OK" % (each_line + 1, each_title + 1))
                    else:
                        result_list.append("%s %s ERR" % (each_line + 1, each_title + 1))
                elif '批次' in m_title or '组号' in m_title or '类型ID' in m_title or '礼包数量' in m_title or '道具数量' in m_title:
                    if (table.cell(each_line, each_title).ctype == 2) or (table.cell(each_line, each_title).ctype == 0):
                        result_list.append("%s %s OK" % (each_line + 1, each_title + 1))
                    else:
                        result_list.append("%s %s ERR" % (each_line + 1, each_title + 1))
                elif '' in m_title or '道具ID' in m_title:
                    if (table.cell(each_line, each_title).ctype == 1) or (table.cell(each_line, each_title).ctype == 0):
                        result_list.append("%s %s OK" % (each_line + 1, each_title + 1))
                    else:
                        result_list.append("%s %s ERR" % (each_line + 1, each_title + 1))
        result = '\n'.join(result_list)
        tkMessageBox.showinfo('Message', '配置结果如下（行号 列号 状态）:\n%s' % result)

app = Application()
# 设置窗口标题:
app.master.title('配置检查')
# 主消息循环:
app.mainloop()
