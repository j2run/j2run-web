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
  runCommandRemote "chmod +x $fileDockerRemote"
  runCommandRemote "$fileDockerRemote"
  dockerVersion=$(runCommandRemote "$cmdGetDockerVersion")
fi

if [ -z "${dockerVersion}" ]; then
  echo "Docker not installed"
  exit;
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
fileJ2ProdBackendRemote="~/j2-prod-server.tar"
fileJ2ProdBackendContinue=1
if ssh -q -o ConnectTimeout=10 "${SSH_USERNAME}@${SSH_HOST}" "[ -f ${fileJ2ProdBackendRemote} ]"; then
    echo "File ${fileJ2ProdBackendRemote} exists on the remote server."
    read -p "You can overwrite ${fileJ2ProdBackendRemote}? (y/n): " answer
    if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
      fileJ2ProdBackendContinue=1
      echo "${fileJ2ProdBackendRemote} overwrite it!"
    else
      fileJ2ProdBackendContinue=0
    fi
else
    echo "File ${fileJ2ProdBackendRemote} does not exist on the remote server."
fi

imageJ2ProdFrontend="j2-prod-frontend:latest"
fileJ2ProdFrontend="${currentDir}/../data-docker/j2-prod-frontend.tar"
fileJ2ProdFrontendRemote="~/j2-prod-frontend.tar"
fileJ2ProdFrontendContinue=1
if ssh -q -o ConnectTimeout=10 "${SSH_USERNAME}@${SSH_HOST}" "[ -f ${fileJ2ProdFrontendRemote} ]"; then
    echo "File ${fileJ2ProdFrontendRemote} exists on the remote server."
    read -p "You can overwrite ${fileJ2ProdFrontendRemote}? (y/n): " answer
    if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
      fileJ2ProdFrontendContinue=1
      echo "${fileJ2ProdFrontendRemote} overwrite it!"
    else
      fileJ2ProdFrontendContinue=0
    fi
else
    echo "File ${fileJ2ProdFrontendRemote} does not exist on the remote server."
fi

runCommandRemote "mkdir -p /data"
runCommandRemote "mkdir -p /data/data"

# build backend
if [ "$fileJ2ProdBackendContinue" -eq 1 ]; then
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
fi

# build frontend
if [ "$fileJ2ProdFrontendContinue" -eq 1 ]; then
  echo "Building frontend..."
  docker build -f "${currentDir}/../docker/prod.nginx.Dockerfile" -t "${imageJ2ProdFrontend}" "${currentDir}/.."

  echo "Save frontend image to file..."
  if [ -f "${fileJ2ProdFrontend}" ]; then
    echo "Remove frontend image old..."
    rm -f "${fileJ2ProdFrontend}"
  fi
  docker save -o "${fileJ2ProdFrontend}" "${imageJ2ProdFrontend}"

  echo "Remove frontend image..."
  docker rmi "${imageJ2ProdFrontend}"
fi

# stop & remove image
cmdRemoveImage=" \
cd /data;
docker compose --env-file .env.prod -f docker-compose.prod.yaml down; \
"
echo "Container Stoping..."
runCommandRemote "$cmdRemoveImage"

# push conf to remote
runCommandRemote "rm -rf ${FOLDER_CONF}"
scp -r "${currentDir}/../conf/production/" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_CONF}"

# push env
scp "${currentDir}/../env/.env.prod" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_DATA}"

# push docker-compose file to remote
scp "${currentDir}/../docker/docker-compose.prod.yaml" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_DATA}"


# push image & game to remote
isExistsDataImg=$(runCommandRemote "test -d ${FOLDER_IMG} && echo 1 || echo 0")
overwriteDataImg=1
if [ "$isExistsDataImg" -eq 1 ]; then
  echo "Folder ${FOLDER_IMG} exists on the remote server."
  read -p "You can overwrite ${FOLDER_IMG}? (y/n): " answer
  if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
    overwriteDataImg=1
    echo "${FOLDER_IMG} overwrite it!"
  else
    overwriteDataImg=0
  fi
fi

if [ "$overwriteDataImg" -eq 1 ]; then
  runCommandRemote "rm -rf ${FOLDER_IMG}"
  scp -r "${currentDir}/../data-img/" "${SSH_USERNAME}@${SSH_HOST}:${FOLDER_IMG}"
  runCommandRemote "chmod -R +r ${FOLDER_IMG}"
fi

# push backend to remote
if [ "$fileJ2ProdBackendContinue" -eq 1 ]; then
  echo "Push server image..."
  scp "$fileJ2ProdBackend" "${SSH_USERNAME}@${SSH_HOST}:~/"
  runCommandRemote "docker rmi ${imageJ2ProdBackend}; docker load -i ${fileJ2ProdBackendRemote};"
fi


# push frontend to remote
if [ "$fileJ2ProdFrontendContinue" -eq 1 ]; then
  echo "Push frontend image..."
  scp "$fileJ2ProdFrontend" "${SSH_USERNAME}@${SSH_HOST}:~/"
  runCommandRemote "docker rmi ${imageJ2ProdFrontend}; docker load -i ${fileJ2ProdFrontendRemote};"
fi

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