#!/bin/bash

function getUfwCommand() {
  echo "ufw --force disable;"
  echo "ufw --force reset;"
  echo "ufw default deny incoming;"
  echo "ufw default allow outgoing;"
  echo "ufw allow 22;"
  echo "ufw allow 80;"
  echo "ufw allow 443;"

  echo "ufw allow from ${1} to any port 2376;"

  echo "ufw --force enable;"
}