require('../modules/games');
require('../modules/games/heyoftheday');
require('../modules/games/roulette');
require('../modules/games/tomatoes');
require('../modules/poll');

const { Router } = require('express');

const { Dispatcher } = require('../modules/dispatcher');

const dispatcher = Dispatcher();

const router = Router();

const token = process.env.TELEGRAM_TOKEN || '';

// We are receiving updates at the route below!
router.post(`/bot${token}`, (req, res) => {
  dispatcher.dispatch(req.body);

  res.sendStatus(200);
});

module.exports = router;
