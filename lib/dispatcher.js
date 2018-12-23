const { RateLimiter } = require('limiter');

const bot = require('./bot');

const limiter = new RateLimiter(1, 'hour', true);

// FIXME
const defaultCommand = (msg) => {
  const { chat: { id } } = msg;
  // debug('defaultCommand %j', message);
  return bot.sendMessage(id, 'Нет такой команды');
};

const getCommand = (msg) => {
  const { entities = [], text = '' } = msg;

  if (Array.isArray(entities) && entities.length > 0) {
    const { length, offset, type } = entities.shift();

    if (type === 'bot_command') {
      return text.slice(offset, text.indexOf('@') > 0 ? text.indexOf('@') : length);
    }
  }

  return null;
};

const commands = {
  '/hey': (msg) => {
    const { chat: { id }, from: { username } } = msg;
    return bot.sendMessage(id, `Hey, ${username}`);
  }
};

const handleCommand = (command) => {
  if (command) {
    return commands[command] ? commands[command] : defaultCommand;
  }
  return defaultCommand;
};

const dispatch = (msg) => {
  const { chat: { id }, from: { username } } = msg;
  const command = getCommand(msg);

  limiter.removeTokens(1, (err, remainingRequests) => {
    if (remainingRequests < 0) {
      return bot.sendMessage(id, `Я отвечал на это не больше часа назад, ${username}`);
    }

    return handleCommand(command)(msg);
  });
};

module.exports = dispatch;
