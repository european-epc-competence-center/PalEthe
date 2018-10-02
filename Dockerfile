FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g truffle

COPY package.json .

RUN npm install

COPY . .

RUN truffle compile

EXPOSE 3000
CMD ["/usr/src/app/docker_run.sh"]