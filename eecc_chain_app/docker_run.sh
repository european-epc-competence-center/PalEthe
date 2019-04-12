#!/bin/bash
set -e

cd /usr/src/app

if [ ! -z "$FALLBACK_IP" ]; then 
  echo "Using fallback ip ${FALLBACK_IP} for the web3 provider"
  sed -i -e "s/127\.0\.0\.1/${FALLBACK_IP}/" src/utils/getWeb3.js
fi

echo -e "[...]\t Using truffle network ${NETWORK:=ganache_docker}"

until truffle migrate --network ${NETWORK}
do
  echo -e "[...]\t Migration failed... waiting for network to come up..."  
  sleep 5
  echo -e "[...]\t Retry..."
done
echo -e "[OK]\t Migration successfull!"


npm start
