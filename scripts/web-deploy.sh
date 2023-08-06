#!/bin/bash
currentDir=$(dirname "$0")

source "${currentDir}/env_file.txt"

SSH_USERNAME=${1:-"${SSH_USERNAME}"}
SSH_HOST=${2:-"${SSH_HOST}"}
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
  runCommandRemote "chmod +x $fileDockerRemote; $fileDockerRemote;"
  dockerVersion=$(runCommandRemote "$cmdGetDockerVersion")
fi
echo "Docker installed! version: $dockerVersion"

#####################
# build & push
# /data/img
# /data/conf
# /data/data/redis
# /data/data/mongo
FOLDER_CONF=/data/conf
FOLDER_IMG=/data/img
FOLDER_DATA=/data
imageJ2ProdBackend="j2-prod-server:latest"
fileJ2ProdBackend="${currentDir}/../data-docker/j2-prod-server.tar"
fileJ2ProdRemote="~/j2-prod-server.tar"

runCommandRemote "mkdir -p /data"
runCommandRemote "mkdir -p /data/data"

# push conf to remote
scp -r "${currentDir}/../conf/production/" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_CONF}"

# push image & game to remote
scp -r "${currentDir}/../data-img/" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_IMG}"

# push env
scp "${currentDir}/../env/.env.prod" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_DATA}"

# push docker-compose file to remote
scp "${currentDir}/../docker/docker-compose.prod.yaml" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_DATA}"

# build backend
echo "Building server..."
docker build -f "${currentDir}/../docker/prod.backend.Dockerfile" -t "${imageJ2ProdBackend}" "${currentDir}/.."

echo "Save server image to file..."
if [ -f "${fileJ2ProdBackend}" ]; then
  echo "Remove server image old..."
  rm -f "${fileJ2ProdBackend}"
fi
docker save -o "${fileJ2ProdBackend}" "${imageJ2ProdBackend}"

echo "Remove server image..."
docker rmi "${imageJ2ProdBackend}"

# stop & remove image
cmdRemoveImage=" \
cd /data;
docker compose --env-file .env.prod -f docker-compose.prod.yaml down; \
"
echo "Container Stoping..."
runCommandRemote "$cmdRemoveImage"

# push backend to remote
echo "Push server image..."
scp "$fileJ2ProdBackend" "${SSH_USERNAME}@${SSH_HOST}:~/"
runCommandRemote "docker rmi ${imageJ2ProdBackend}; docker load -i ${fileJ2ProdRemote};"

# deploy web
cmdDeploy=" \
cd /data;
docker compose --env-file .env.prod -f docker-compose.prod.yaml up -d --remove-orphans --build --force-recreate; \
"
runCommandRemote "$cmdDeploy"

# setup ufw
source "${currentDir}/web-update-ufw.sh"
runCommandRemote "$(getUfwCommand)"
runCommandRemote "ufw status"