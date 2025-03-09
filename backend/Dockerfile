FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --arch=x64 --platform=linux

COPY . .

COPY .env.prod .env

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]