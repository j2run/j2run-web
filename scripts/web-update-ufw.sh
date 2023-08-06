#!/bin/bash

function getUfwCommand() {
  echo "ufw --force disable;"
  echo "ufw --force reset;"
  echo "ufw default deny incoming;"
  echo "ufw default allow outgoing;"
  echo "ufw allow 22;"
  echo "ufw allow 80;"
  echo "ufw allow 443;"

  # local publicIpStr=$(dig +short txt ch whoami.cloudflare @1.0.0.1)
  # local publicIp=$(echo "$publicIpStr" | sed 's/"//g')
  # echo "ufw allow from ${publicIp} to any port 27017;"
  # echo "ufw allow from ${publicIp} to any port 6379;"

  echo "ufw --force enable;"
}