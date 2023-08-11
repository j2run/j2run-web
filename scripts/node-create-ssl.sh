#!/bin/bash

certbot certonly  -d "${J2_DOMAIN_SSL}" -d "*.${J2_DOMAIN_SSL}" --preferred-challenges=dns --manual
openssl dhparam -out /etc/letsencrypt/dhparams.pem -dsaparam 4096