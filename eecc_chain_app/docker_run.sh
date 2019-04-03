#!/bin/bash
set -e

cd /usr/src/app

if [ ! -z "$FALLBACK_IP" ]; then 
  echo "Using fallback ip ${FALLBACK_IP} for the web3 provider"
  sed -i -e "s/127\.0\.0\.1/${FALLBACK_IP}/" src/utils/getWeb3.js
fi

truffle migrate --network ganache_docker

npm start
