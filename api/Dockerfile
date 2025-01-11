FROM node:22.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8000

CMD ["node", "app.js"]
