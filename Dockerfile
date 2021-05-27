FROM node:16-alpine

LABEL maintainer="Andrei Tretyakov <andrei.tretyakov@gmail.com>"

RUN ln -fs /usr/share/zoneinfo/Europe/Moscow /etc/localtime && apk add --update tzdata

ENV NODE_ENV production

ENV PATH $PATH:/opt/sayhey/bin

RUN mkdir -p /opt/sayhey/logs

COPY . /opt/sayhey

WORKDIR /opt/sayhey

RUN npm install pm2 -g && npm install

EXPOSE 3000

CMD ["pm2-docker", "pm2.json"]
