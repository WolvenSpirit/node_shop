FROM node:latest

COPY . .

RUN npm install

RUN npm i -g typescript

RUN tsc

COPY .env ./bin/.env

WORKDIR ./bin

RUN mkdir images

ENTRYPOINT node ./bin/main.js