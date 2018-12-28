# sayhey

[![CircleCI](https://circleci.com/gh/ofkindness/sayhey/tree/master.svg?style=svg)](https://circleci.com/gh/ofkindness/sayhey/tree/master)
[![Dependency Status](https://david-dm.org/ofkindness/sayhey.svg?theme=shields.io)](https://david-dm.org/ofkindness/sayhey)

Sayhey telegram bot
===================

Demo
----

You can add @sayhey_bot to your channel for demonstration. See Command list for game details

Installation
------------

```console
  $ git clone https://github.com/ofkindness/sayhey.git
  $ cd sayhey && npm i
```

Dockerize
---------

```console
docker build -t sayhey .

docker run -e NODE_ENV=development -e TELEGRAM_TOKEN=yourtelegramtoken --name sayhey --link redis -p 127.0.0.1:3000:3000 -d sayhey
```

Start bot
---------

```console
DEBUG=* WEBHOOK_URL=yourapiurl TELEGRAM_TOKEN=yourtelegramtoken npm start
```

Tests
-----

```console
npm test
```
