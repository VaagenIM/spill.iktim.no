FROM node:lts-slim
ENV NODE_ENV=production
ENV BASE_URL='iktim.no'

WORKDIR /app

COPY src/. .

RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*
RUN npm install --production

EXPOSE 80/tcp

CMD [ "node", "server.js" ]
