#!/usr/bin/python

#pip install python-etcd

import etcd
import re
import sys
import paramiko
import socket
import termios
import tty

etcd_host='etcd.yingxiong.net'
dns_root='skydns/net/yingxiong'
server_type = sys.argv[1]
#run_mode = sys.argv[2]
pkey = paramiko.RSAKey.from_private_key_file('./AWSYingxiong.pem')
client = etcd.Client(host=etcd_host, port=2379)
server_list = client.read(dns_root, recursive=True, sorted=True)
host_dict = {}
for each_server in server_list.children:
  each_key = each_server.key
  each_value = each_server.value
  #print each_server.value
  want_key = each_key.replace('/'+dns_root+'/', '')
  if each_value:
    want_value = re.findall(r'\d{1,3}\.+\d{1,3}\.+\d{1,3}\.+\d{1,3}',each_value)
    host_dict[want_key] = want_value
#    print want_key,want_value
#print host_dict
def get_server_list(server_type='redis',run_mode=None):
  for m_key in dict.keys(host_dict):
    m_pattern = re.compile(r'.*%s.*' % server_type)
    match_str = m_pattern.match(m_key)
    if match_str:
      print m_key,host_dict[m_key]
      host_addr= str(host_dict[m_key]).replace('[','').replace(']','').replace("'",'').replace('u','')
      #print host_addr.replace('[','').replace(']','').replace('u',''),type(host_addr)
      if run_mode == 'ssh':
        run_ssh_methon(host_addr)
def posix_shell(chan):
    import select
    oldtty = termios.tcgetattr(sys.stdin)
    try:
        tty.setraw(sys.stdin.fileno())
        tty.setcbreak(sys.stdin.fileno())
        chan.settimeout(0.0)
        while True:
            r, w, e = select.select([chan, sys.stdin], [], [])
            if chan in r:
                try:
                    x = chan.recv(1024)
                    if len(x) == 0:
                        #print '\r\n*** EOF\r\n',
                        break
                    sys.stdout.write(x)
                    sys.stdout.flush()
                except socket.timeout:
                    pass
            if sys.stdin in r:
                x = sys.stdin.read(1)
                if len(x) == 0:
                    break
                chan.send(x)
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, oldtty)
def run_ssh_methon(m_host):
  ssh = paramiko.SSHClient()
  ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
  ssh.connect(hostname=m_host,
            port=22,
            username='ec2-user',
            pkey=pkey)
  channel=ssh.invoke_shell()
  posix_shell(channel)
  channel.close()
  ssh.close()


if __name__ == '__main__':
  if len(sys.argv[1:]) == 1:
    get_server_list(server_type)
  elif len(sys.argv[1:]) == 2:
    print 'use run mode'
    get_server_list(server_type,sys.argv[2])
