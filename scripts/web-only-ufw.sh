#!/bin/bash

currentDir=$(dirname "$0")

source "${currentDir}/env_file.txt"
SSH_USERNAME=${1:-"${SSH_USERNAME}"}
SSH_HOST=${2:-"${SSH_HOST}"}

# common
source "${currentDir}/common/common.sh"

source "${currentDir}/web-update-ufw.sh"
runCommandRemote "$(getUfwCommand)"
runCommandRemote "ufw status"