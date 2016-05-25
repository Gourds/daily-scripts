#!/bin/bash
curl --user "{{system_init.name}}:{{system_init.password}}" http://{{system_init.usergrid.host}}:{{system_init.usergrid.port}}/system/database/setup
curl --user "{{system_init.name}}:{{system_init.password}}" http://{{system_init.usergrid.host}}:{{system_init.usergrid.port}}/system/superuser/setup