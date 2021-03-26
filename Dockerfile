FROM node:current-alpine3.13

WORKDIR /usr/api

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

CMD ["yarn", "start:dev"]