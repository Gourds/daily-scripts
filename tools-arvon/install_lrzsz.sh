#!/bin/sh
###############################################################################
#Author: arvon
#Email:arvon2014@gmail.com
#Blog: http://blog.arvon.top/
#Date:
#Filename: install_lrzsz.sh
#Revision: 1.0
#License: GPL
#Description:
#Notes:https://ohse.de/uwe/software/lrzsz.html
##############################################################################

pkg_version='lrzsz-0.12.20.tar.gz'
wget https://ohse.de/uwe/releases/${pkg_version}
tar xvf ${pkg_version}
cd ${pkg_version%\.tar\.gz}
./configure --prefix=/usr/local/lrzsz
make && make install
ln -s /usr/local/lrzsz/bin/lrz /usr/bin/rz
ln -s /usr/local/lrzsz/bin/lsz /usr/bin/sz
