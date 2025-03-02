FROM node:latest

WORKDIR /app

COPY package.json /app

RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]