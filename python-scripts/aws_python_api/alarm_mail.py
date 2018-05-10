# -*- coding: utf-8 -*-

import ConfigParser
import smtplib
from email import encoders
from email.header import Header
from email.mime.text import MIMEText
from email.utils import parseaddr, formataddr


aws_config = ConfigParser.ConfigParser()
aws_config.read('aws_config.ini')



class mail():
    def __init__(self):
        self.smtp_server = aws_config.get('mail_config', "smtp_server")
        self.smtp_port = aws_config.get('mail_config', "smtp_port")
        self.smtp_username = aws_config.get('mail_config', "smtp_username")
        self.smtp_password = aws_config.get('mail_config', "smtp_password")



    def send_html_mail(self,sender,receiver,area,content):
        server = smtplib.SMTP(self.smtp_server,self.smtp_port)
        server.set_debuglevel(1)
        server.login(self.smtp_username,self.smtp_password)
        msg = MIMEText(str(content),'html','utf-8')
        # msg['From'] =
        # msg['To'] =
        msg['Subject'] = Header(u'AWS预购实例%s报警' % str(area), 'utf-8').encode()
        server.sendmail(sender,[receiver],msg.as_string())


if __name__ == '__main__':
    test = mail()
    test.send_mail('monitor@check-num.net', 'guoyafeng@taiyouxi.cn', 'haha')