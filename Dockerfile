FROM node:alpine
RUN apk add --update curl
COPY package.json ./package.json

RUN npm install

COPY . .

CMD ["node", "index.js"]
