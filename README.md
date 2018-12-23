Sayhey telegram bot
===================

Demo
----

You can add @sayhey_bot to your channel for demonstration. See Command list for game details

Installation
------------

```console
  $ git clone https://github.com/ofkindness/sayhey.xyz.git
  $ cd sayhey.xyz && npm i
```

Dockerize
---------

```console
docker build -t sayhey .

docker run -e NODE_ENV=development -e TELEGRAM_TOKEN=yourtelegramtoken --name sayhey --link redis -p 127.0.0.1:3000:3000 -d sayhey
```

Start frontend
--------------

```console
npm start
```

Build frontend
--------------

```console
npm run build
```


Start bot
-----

```console
DEBUG=* WEBHOOK_URL=yourapiurl TELEGRAM_TOKEN=yourtelegramtoken npm run bot
```

Tests
-----

```console
npm test
```
