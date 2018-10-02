#!/bin/bash
set -e

cd /usr/src/app

truffle migrate --network ganache_docker

npm start
