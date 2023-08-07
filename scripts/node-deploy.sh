#!/bin/bash
currentDir=$(dirname "$0")

source "${currentDir}/env_file.txt"

SSH_USERNAME_MASTER="$SSH_USERNAME"
SSH_HOST_MASTER="$SSH_HOST"

SSH_USERNAME=$1
SSH_HOST=$2
FILE_DOCKER_SETUP="${currentDir}/common/setup-docker.sh"

echo "SSH: ${SSH_HOST}, USERNAME: ${SSH_USERNAME}"

# common
source "${currentDir}/common/common.sh"

# push ssh key
source "${currentDir}/common/ssh.sh"
pushSshKey "$SSH_USERNAME" "$SSH_HOST"

# install docker
cmdGetDockerVersion="docker version --format '{{.Server.Version}}'"
dockerVersion=$(runCommandRemote "$cmdGetDockerVersion")
if [ -z "$dockerVersion" ]; then
  echo "Docker installing..."
  fileDockerRemote="~/setup-docker.sh"
  scp "$FILE_DOCKER_SETUP" "${SSH_USERNAME}@${SSH_HOST}:~/"
  runCommandRemote "chmod +x $fileDockerRemote"
  runCommandRemote "$fileDockerRemote"
  dockerVersion=$(runCommandRemote "$cmdGetDockerVersion")
fi

if [ -z "${dockerVersion}" ]; then
  echo "Docker not installed"
  exit;
fi

echo "Docker installed! version: $dockerVersion"
