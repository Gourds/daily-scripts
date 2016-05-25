LVM
============

This role helps to install LVM and create the LVM partitions on RHEL. 

Requirements
============

This role requires Ansible 1.1 or higher.

Role Variables
==============

The variables that can be passed to this role and a brief description about them are as followings:
    
    lvm_pkgs:
    - lvm2

    lvm_create:
    - vg: "data"
      pv: "/dev/xvdb"
      lv: "apps"
      mount_point: "/data"

Examples
===========

1) Install the LVM packages and create one LVM partition with 1 disk
    
    - hosts: all
      roles:
      - { role: lvm, 
          lvm_create: [
          {vg: "data", pv: "/dev/xvdb", lv: "apps", mount_point: "/data" }
          ]
        }

2) Install the LVM packages and create one LVM partition with 2 disks
    
    - hosts: all
      roles:
      - { role: lvm, 
          lvm_create: [
          {vg: "data", pv: "/dev/xvdb,/dev/xvdc", lv: "apps", mount_point: "/data" }
          ]
        }

3) Install the LVM packages and create 2 LVM partitions.
    
    - hosts: all
      roles:
      - { role: lvm, 
          lvm_create: [
          {vg: "data", pv: "/dev/xvdb", lv: "apps", mount_point: "/data" },
          {vg: "data2", pv: "/dev/xvdc", lv: "apps2", mount_point: "/data2" }
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
