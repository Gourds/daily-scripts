#!/usr/bin/env python
# Requier: pip install GitPython
# http://note.qidong.name/2018/01/gitpython/
import socket
import threading
import os
import git
import time




class init_socket():
    def __init__(self, HOST_NAME, HOST_PORT, MAX_CLIENT):
        self.host_name = HOST_NAME
        self.host_port = HOST_PORT
        self.ss = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.ss.bind((HOST_NAME, HOST_PORT))
        self.ss.listen(MAX_CLIENT)
    def run(self, REMOTE_PATH, LOCAL_PATH):
        res_ok = 'HTTP/1.1 200 OK\nContent-Type:text/html\nServer:myserver\n\nHello, Gourds!'
        res_xx = 'HTTP/1.1 404 OK\nContent-Type:text/html\nServer:myserver\n\nFriend!'
        while True:
            sock, addr = self.ss.accept()
            print sock, addr
            request = sock.recv(1024)
            method = request.split(' ')[0]
            src = request.split(' ')[1]
            print method, src
            if method == 'POST':
                if src == '/hook/push':
                    content = res_ok
                    if len(os.listdir(LOCAL_PATH)) <= 1:
                        git.Repo.clone_from(url=REMOTE_PATH, to_path=LOCAL_PATH)
                        print "Run clone command"
                    else:
                        gp = git.cmd.Git(LOCAL_PATH)
                        gp.pull()
                        print "Run pull command"
                else:
                    content = res_xx
            else:
                content = res_xx
            print content
            sock.sendall(content)
            print request
            sock.close()
            time.sleep(60)


if __name__ == '__main__':
    my_app = init_socket("", 18080, 5)
    my_app.run('git@github.com:Gourds/personal-blog.git', '/data/docker-app/blog-data/static/')
