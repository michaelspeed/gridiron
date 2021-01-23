FROM node:14-alpine

WORKDIR /app

COPY . .


RUN rm -rf node_modules

RUN yarn --frozen-lockfile

EXPOSE 3000 5588 5002

CMD npm run launch