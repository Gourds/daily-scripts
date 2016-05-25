Monit
============

This role helps to install monit and put on the base configuraion files. 

Requirements
============

None.

Role Variables
==============

The variables that can be passed to this role and a brief description about them are as followings:
   
    monit_pkgs:
    - monit
    ipaddr: 127.0.0.1
    mailserver: localhost
    alertto: monitor@localhost
    
Examples
===========

Install the monit packages 
    
    - hosts: all
      roles:
      - { role: monit, 
          ipaddr: 127.0.0.1
          mailserver: localhost
          alertto: monitor@localhost
        }

Dependencies
=============

None

License
=============

BSD

Auth Information
================
Zhongqiang Dou
