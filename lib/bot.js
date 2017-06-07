import Debug from 'debug';
import TelegramBot from 'node-telegram-bot-api';

import * as heyoftheday from './games/heyoftheday';
import dispatch from './dispatcher';
import help from './help';
// import queue from './queue';
import roulette from './games/russian';
import { createPoll as poll, makeChoice } from './vote';
import say from './say';
import start from './start';
import tomatoes from './tomatoes';

const debug = Debug('sayhey:bot');


const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  port: 443
});

bot.on('callback_query', msg => makeChoice(msg));

const commands = Object.assign(heyoftheday
  , {
    help
  }, {
    poll
  }, {
    roulette
  }, {
    say
  }, {
    start
  }, {
    tomatoes
  });


bot.on('message', (msg) => {
  debug(msg);
  return dispatch(commands, msg)
    .then(result => Promise.resolve(result))
    .catch(err => Promise.reject(err));
});

export default bot;
