USERS
============

This role helps to create users. 

Requirements
============

None

Role Variables
==============

The variables that can be passed to this role and a brief description about them are as followings:

    users:
      - user: user1 
        passwd: '$6$rurounds=0000$eHcfnk.a/Pb1bssk$FaS9YziBEi7Kyj39TK1r1ZGU8agvvCMkdoRVxRaemMycRmTKIAVCJssVNBmvS6Bo4TEvN8vms.'
        comment: 'user1'
        shell: /bin/bash
        group: user1
        groups: "nginx,mysql"
        append: yes

Examples
===========

1) create 1 user
    
    - hosts: all
      roles:
      - { role: users, 
          user: [
          {user: "user1", comment: "user1", shell: /bin/bash, group: user1, groups: "nginx,mysql", append: yes}
          ]
        }

2) create 2 users
    
    - hosts: all
      roles:
      - { role: users, 
          user: [
          {user: "user1", comment: "user1", shell: /bin/bash, group: user1, groups: "nginx,mysql", append: yes}
          {user: "user2", comment: "user2", shell: /bin/bash, group: user2, groups: "nginx,tomcat", append: yes}
          ]
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
