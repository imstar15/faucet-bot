FROM node:16-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

ENTRYPOINT ["./node_modules/.bin/pm2", "start", "--no-daemon", "ecosystem.config.js"]
