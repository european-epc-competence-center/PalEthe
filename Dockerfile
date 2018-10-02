FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g truffle

COPY eecc_chain_app/package.json .

RUN npm install

COPY eecc_chain_app/. .

RUN truffle compile

EXPOSE 3000
CMD ["/usr/src/app/docker_run.sh"]