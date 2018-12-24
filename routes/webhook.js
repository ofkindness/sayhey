require('../lib/games');
require('../lib/games/heyoftheday');

const { Router } = require('express');

const { dispatcher } = require('../lib/bot');

const router = Router();

const token = process.env.TELEGRAM_TOKEN || '';

// We are receiving updates at the route below!
router.post(`/bot${token}`, (req, res) => {
  dispatcher.dispatch(req.body);

  res.sendStatus(200);
});

module.exports = router;
