FROM node:latest

COPY . .

RUN npm install

RUN npm i -g typescript

RUN tsc

COPY .env ./bin/.env

RUN mkdir ./bin/images; exit 0;

ENTRYPOINT node ./bin/main.js