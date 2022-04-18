FROM node:16

WORKDIR /server

COPY . /server

RUN apk add --no-cache make gcc g++ python3 ; \
  npm install --production --silent ; \
  apk del make gcc g++ python3
