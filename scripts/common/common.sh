#!/bin/bash

if [ -z $SSH_USERNAME ] || [ -z $SSH_HOST ]; then
  echo "need SSH_USERNAME, SSH_HOST variable";
  exit
fi

function runCommandRemote() {
  local cmd=$1
  ssh "${SSH_USERNAME}@${SSH_HOST}" "$cmd"
}