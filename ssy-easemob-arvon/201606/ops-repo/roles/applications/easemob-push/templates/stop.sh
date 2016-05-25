#!/bin/bash

kill -9 `ps aux|grep ' -jar /data/apps/opt/easemob-{{ profile.service_name }}/{{ profile.package_name }}-'|grep -v grep |awk '{print $2}'` && \
	rm /data/apps/var/usergrid/easemob-{{ profile.service_name }}.pid
