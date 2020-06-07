FROM node:12.16.3

WORKDIR /code

COPY package.json /code/package.json

RUN npm install

COPY . /code

CMD ["node", "server/server.js"]