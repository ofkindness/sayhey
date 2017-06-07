/* eslint no-console: 0 */
import Debug from 'debug';
import express from 'express';
import bot from '../lib/bot';

const debug = Debug('sayhey:webhook');
const router = express.Router();

/* handler for webhook request */
router.post('/:token', (req, res) => {
  debug(req.body);

  if (req.params.token !== process.env.TELEGRAM_TOKEN) {
    return res.status(403).end();
  }

  bot.processUpdate(req.body);
  return res.sendStatus(200);
});

export default router;
