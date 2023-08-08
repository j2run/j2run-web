#!/bin/bash
currentDir=$(dirname "$0")

source "${currentDir}/env_file.txt"

SSH_USERNAME_MASTER="$SSH_USERNAME"
SSH_HOST_MASTER="$SSH_HOST"

SSH_USERNAME=$1
SSH_HOST=$2
SSH_PORT=$3
FILE_DOCKER_SETUP="${currentDir}/common/setup-docker.sh"

echo "SSH: ${SSH_HOST}, USERNAME: ${SSH_USERNAME}, PORT: ${SSH_PORT}"

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

# stop nginx
fileDockerCompose="${currentDir}/../docker/docker-compose.prod-node.yaml"
fileDockerComposeRemote="/data/docker-compose.prod-node.yaml"
cmdRemoveImage=" \
cd /data;
docker compose -f $fileDockerComposeRemote down; \
"
echo "Container Stoping..."
runCommandRemote "$cmdRemoveImage"

# push conf
fileNginxNodeConf="${currentDir}/../conf/production/nginx-node.conf"
fileNginxNodeConfRemote="/data/conf/nginx.conf"

echo "Push nginx conf..."
runCommandRemote "mkdir -p /data/conf"
runCommandRemote "rm -rf $fileNginxNodeConfRemote"
scp "${fileNginxNodeConf}" "${SSH_USERNAME}@${SSH_HOST}:${fileNginxNodeConfRemote}"

# update conf
ipDocker=$(runCommandRemote "docker network inspect bridge --format '{{(index .IPAM.Config 0).Gateway}}' | awk -F '.' '{print \$1\".\"\$2}'")
echo "Update nginx conf.. ${ipDocker}"
cmdUpdateIp="sed -i 's/proxy_pass http:\/\/__FIX__.\$1:5900;/proxy_pass http:\/\/$ipDocker.\$1:5900;/' $fileNginxNodeConfRemote"
runCommandRemote "${cmdUpdateIp}"

# need update
# ---------------------------------------------------
# # update docker
fileDockerService="/usr/lib/systemd/system/docker.service"
fileDockerServiceContinue=1
checkExistDockerServiceConfig=$(runCommandRemote "cat $fileDockerService | grep '0.0.0.0:2376'")
if [ "$checkExistDockerServiceConfig" ]; then
  echo "File ${fileDockerService} exists on the remote server."
  read -p "You can re-config ${fileDockerService}? (y/n): " answer
  if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    fileDockerServiceContinue=1
    echo "${fileDockerService} re-config!"
  else
    fileDockerServiceContinue=0
  fi
fi

if [ "$fileDockerServiceContinue" -eq 1 ]; then
  echo "Update docker.. ${ipDocker}"
  cmdUpdateIp="sed -i 's/-H fd:\/\//-H tcp:\/\/0.0.0.0:2376 -H unix:\/\/\/var\/run\/docker.sock/' $fileDockerService"
  runCommandRemote "${cmdUpdateIp}"
  runCommandRemote "systemctl daemon-reload; \
  systemctl restart docker"
fi

# push docker-compose file to remote
runCommandRemote "rm -rf $fileDockerComposeRemote"
scp "${fileDockerCompose}" "${SSH_USERNAME}@${SSH_HOST}:${fileDockerComposeRemote}"

# deploy web
cmdDeploy=" \
cd /data;
docker compose -f $fileDockerComposeRemote up -d --remove-orphans --build --force-recreate; \
"
runCommandRemote "$cmdDeploy"

# setup ufw
source "${currentDir}/node-update-ufw.sh"
runCommandRemote "$(getUfwCommand $SSH_HOST_MASTER)"
runCommandRemote "ufw status"