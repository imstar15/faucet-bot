FROM node:16-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

ENTRYPOINT ["npm", "run", "db:migration"]
