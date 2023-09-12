#!/bin/bash
currentDir=$(dirname "$0")

source "${currentDir}/env_file.txt"

SSH_USERNAME_MASTER="$SSH_USERNAME"
SSH_HOST_MASTER="$SSH_HOST"

SSH_USERNAME=$1
SSH_HOST=$2
SSH_PORT=$3
SSH_KEY="${currentDir}/lab/id_rsa"
FILE_DOCKER_SETUP="${currentDir}/common/setup-docker.sh"

echo "SSH: ${SSH_HOST}, USERNAME: ${SSH_USERNAME}, PORT: ${SSH_PORT}"

# common
source "${currentDir}/common/common.sh"

# stop nginx
fileDockerCompose="${currentDir}/../docker/docker-compose.prod-node.yaml"
fileDockerComposeRemote="/data/docker-compose.prod-node.yaml"
cmdRemoveImage=" \
cd /data;
docker compose -f $fileDockerComposeRemote down; \
"
echo "Container Stoping..."
runCommandRemoteI "$cmdRemoveImage"

# push nginx
fileNginxNodeConfRemote="/data/conf/nginx.conf"
echo "Push nginx conf..."
runCommandRemoteI "mkdir -p /data/conf"
runCommandRemoteI "rm -rf $fileNginxNodeConfRemote"

read -p "You can config ssl? (y/n): " answer
if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
  fileNginxNodeConf="${currentDir}/../conf/production/nginx-node-ssl.conf"
  scp -i "${SSH_KEY}" "${fileNginxNodeConf}" "${SSH_USERNAME}@${SSH_HOST}:${fileNginxNodeConfRemote}"
  echo "${fileNginxNodeConf} push!"

  pairs=(
    "${currentDir}/../keys/live/j2run.com/fullchain.pem /data/ssl/fullchain.pem"
    "${currentDir}/../keys/live/j2run.com/privkey.pem /data/ssl/privkey.pem"
    "${currentDir}/../keys/ssl-dhparams.pem /data/ssl/dhparams.pem"
  )

  runCommandRemoteI "rm -rf /data/ssl"
  runCommandRemoteI "mkdir -p /data/ssl"

  for pair in "${pairs[@]}"; do
    local="${pair% *}"
    remote="${pair#* }"
    echo "${local} -> ${remote}"
    scp -i "${SSH_KEY}" "${local}" "${SSH_USERNAME}@${SSH_HOST}:${remote}"
  done

  fileNginx="${currentDir}/../conf/production/nginx-node-ssl.conf"
  scp -i "${SSH_KEY}" "${fileNginxNodeConf}" "${SSH_USERNAME}@${SSH_HOST}:${fileNginxNodeConfRemote}"
else
  fileNginxNodeConf="${currentDir}/../conf/production/nginx-node.conf"
  scp -i "${SSH_KEY}" "${fileNginxNodeConf}" "${SSH_USERNAME}@${SSH_HOST}:${fileNginxNodeConfRemote}"
  echo "${fileNginxNodeConf} push!"
fi

# update conf
ipDocker=$(runCommandRemoteI "docker network inspect bridge --format '{{(index .IPAM.Config 0).Gateway}}' | awk -F '.' '{print \$1\".\"\$2}'")
echo "Update nginx conf.. ${ipDocker}"
cmdUpdateIp="sed -i 's/proxy_pass http:\/\/__FIX__.\$1:5900;/proxy_pass http:\/\/$ipDocker.\$1:5900;/' $fileNginxNodeConfRemote"
runCommandRemoteI "${cmdUpdateIp}"

# push docker-compose file to remote
runCommandRemoteI "rm -rf $fileDockerComposeRemote"
scp -i "${SSH_KEY}" "${fileDockerCompose}" "${SSH_USERNAME}@${SSH_HOST}:${fileDockerComposeRemote}"

# deploy web
cmdDeploy=" \
cd /data;
docker compose -f $fileDockerComposeRemote up -d --remove-orphans --build --force-recreate; \
"
runCommandRemoteI "$cmdDeploy"
