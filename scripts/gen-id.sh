#!/bin/bash

id=$(id -u)
uname=$(id -nu)

echo "uname:$uname & id:$id"

node scripts/remove-env-host.js

echo "J2_H_NAME=$uname
J2_H_ID=$id" >> env/.env.dev