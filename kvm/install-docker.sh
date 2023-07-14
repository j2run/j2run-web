#!/bin/bash

# Install Docker
yum install -y yum-utils
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io -y

# Restart Docker
systemctl enable docker
systemctl restart docker

# Disable SELinux
setenforce 0
sed -i --follow-symlinks 's/^SELINUX=enforcing/SELINUX=disabled/' /etc/sysconfig/selinux

# Disable Firewall
systemctl disable firewalld >/dev/null 2>&1
systemctl stop firewalld

# Apply sysctl params without reboot
sudo sysctl --system

# Disable swap
sed -i '/swap/d' /etc/fstab
swapoff -a