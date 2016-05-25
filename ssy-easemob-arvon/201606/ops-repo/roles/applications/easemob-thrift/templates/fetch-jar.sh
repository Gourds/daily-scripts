#!/bin/bash -x
cd `dirname $0`

PKG_NAME={{ profile.package_name }}
PKG_VER={{ profile.package_version }}
PKG_URL={{ springboot_package_url }}

HTTP_PROXY="{{ http_proxy_server }}"
if [ "$HTTP_PROXY" != "" -a "$HTTP_PROXY" != "None" ]
then
    CURL_OPTS="-s -x $HTTP_PROXY"
else
    CURL_OPTS="-s "
fi

curl -H 'Authorization: Basic cmVhZGVyOjEyMzQ1Ng==' $CURL_OPTS $PKG_URL.md5 -o $PKG_NAME-$PKG_VER.jar.md5

echo "$(cat $PKG_NAME-$PKG_VER.jar.md5)  $PKG_NAME-$PKG_VER.jar" | md5sum -c
IT_MATCHES=$?

if [ 0 -ne $IT_MATCHES ]
then
	curl -H 'Authorization: Basic cmVhZGVyOjEyMzQ1Ng==' $CURL_OPTS $PKG_URL -o $PKG_NAME-$PKG_VER.jar
fi
echo "$(cat $PKG_NAME-$PKG_VER.jar.md5)  $PKG_NAME-$PKG_VER.jar" | md5sum -c || exit
