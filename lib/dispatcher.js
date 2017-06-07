import RateLimiter from 'rolling-rate-limiter';
import Debug from 'debug';

import bot from './bot';
import { getCommand, getName } from './utils';
import User from './models/user';

const debug = Debug('sayhey:dispatcher');

const limiter = RateLimiter({
  interval: 60 * 60 * 10000, // in miliseconds
  maxInInterval: 1,
  minDifference: 60 * 10000 // optional: the minimum time (in miliseconds) between any two actions
});

// FIXME
const logRequest = (message) => {
  const user = new User(message.from);
  return user.save();
};

// FIXME
const defaultCommand = (message) => {
  debug('defaultCommand %j', message);
  return bot.sendMessage(message.chat.id, 'Нет такой команды');
};

const handleCommand = (commands, command) => {
  if (command) {
    return commands[command] ? commands[command] : defaultCommand;
  }
  return defaultCommand;
};

const dispatch = (commands, message) => {
  const command = getCommand(message);
  if (limiter(`${message.chat.id}:${command}`) > 0) {
    const user = message.from;
    return bot.sendMessage(message.chat.id,
      `Я отвечал на это не больше часа назад, ${getName(user)}`);
  }
  return command ? handleCommand(commands, command)(message) : logRequest(message);
};

export default dispatch;
