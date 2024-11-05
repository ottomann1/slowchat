FROM node:22

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

ENV NODE_ENV=production

CMD ["npm", "start"]
