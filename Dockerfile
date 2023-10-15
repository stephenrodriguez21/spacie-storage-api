# FROM --platform=linux/amd64 node:18.14.1-alpine
FROM node:18.14.1-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
COPY ./startup.dev.sh /opt/startup.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.dev.sh

WORKDIR /usr/src/app
RUN cp env-example .env
RUN npm run build

ENV DATABASE_NAME="api"
ENV DATABASE_USERNAME="nestrest2admin"
ENV DATABASE_PASSWORD="mysecretpassword"
ENV DATABASE_HOST="postgres"

CMD ["/opt/startup.dev.sh"]
