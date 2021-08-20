FROM node:alpine
RUN apk add --update curl

COPY package.json ./package.json

RUN npm install

COPY . .
RUN chmod +x checkenv.sh
RUN chmod +x jetostr.sh
CMD ["node", "index.js"]
