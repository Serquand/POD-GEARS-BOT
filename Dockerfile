FROM node:21
ENV TZ="Europe/Paris"
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "./src/index.js"]