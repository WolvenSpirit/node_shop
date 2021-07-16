FROM node:latest

COPY . .

RUN npm install

RUN npm i -g typescript

RUN tsc

ENTRYPOINT node ./bin/main.js