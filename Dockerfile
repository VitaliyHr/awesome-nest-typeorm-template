FROM node:14.17.1-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8085

ENV NODE_ENV=development DATABASE_HOST=database

CMD [ "node", "dist/main.js" ]
