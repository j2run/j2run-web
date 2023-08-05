#!/bin/bash
currentDir=$(dirname "$0")

SSH_USERNAME=${1:-"root"}
SSH_HOST=${2:-"172.16.10.102"}
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

# push conf to remote

# push image & game to remote

# build backend
imageJ2ProdBackend="j2-prod-server:latest"
echo "Building server..."
docker build -f "${currentDir}/../docker/prod.backend.Dockerfile" -t "${imageJ2ProdBackend}" "${currentDir}/.."

echo "Save server image to file..."
fileJ2ProdBackend="${currentDir}/../data-img/j2-prod-server.tar"
if [ -f "${fileJ2ProdBackend}" ]; then
  echo "Remove server image old..."
  rm -f "${fileJ2ProdBackend}"
fi
docker save -o "${fileJ2ProdBackend}" "${imageJ2ProdBackend}"

echo "Remove server image..."
docker rmi "${imageJ2ProdBackend}"

# push backend to remote
echo "Push server image..."
fileJ2ProdRemote="~/j2-prod-server.tar"
scp "$fileJ2ProdBackend" "${SSH_USERNAME}@${SSH_HOST}:~/"
runCommandRemote "docker rmi ${imageJ2ProdBackend}; docker load -i ${fileJ2ProdRemote};"

# push docker-compose & env to remote


# deploy web
# setup ufw
