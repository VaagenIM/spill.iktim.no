FROM node:lts-slim
ENV NODE_ENV=production
ENV BASE_URL='iktim.no'

WORKDIR /app

COPY src/. .

RUN npm install --production

EXPOSE 80/tcp

CMD [ "node", "server.js" ]
