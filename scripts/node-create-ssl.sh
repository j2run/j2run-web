#!/bin/bash

certbot --nginx -d "${J2_DOMAIN_SSL}" -d "*.${J2_DOMAIN_SSL}" --agree-tos -m "nguyengiahuy16@gmail.com" -n
openssl dhparam -out /etc/letsencrypt/dhparams.pem -dsaparam 4096