FROM node:16-alpine as builder

WORKDIR /app

COPY . /app

RUN npm i

ENTRYPOINT ["./node_modules/.bin/pm2", "start", "--no-daemon", "ecosystem.config.js"]
