const { Router } = require('express');

const bot = require('../lib/bot');
const dispatch = require('../lib/dispatcher');

bot.on('message', msg => dispatch(msg));

const router = Router();
const token = process.env.TELEGRAM_TOKEN || '';

// We are receiving updates at the route below!
router.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

module.exports = router;
