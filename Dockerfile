FROM node:22

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "start"]
