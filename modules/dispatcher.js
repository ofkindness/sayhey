const commands = {};

const parseCommand = (msg) => {
  const { entities = [], text = '' } = msg;

  if (Array.isArray(entities) && entities.length > 0) {
    const { length, offset, type } = entities.shift();

    if (type === 'bot_command') {
      return text.slice(offset, text.indexOf('@') > 0 ? text.indexOf('@') : length);
    }
  }

  return null;
};

//
const handleCommand = (msg) => {
  const command = parseCommand(msg);

  if (command && commands[command]) {
    return commands[command](msg);
  }

  // default command
  return commands.default(msg);
};

module.exports.Dispatcher = (bot) => {
  bot.on('message', msg => handleCommand(msg));

  return {
    dispatch: msg => bot.processUpdate(msg),
    command: (cmd, fn) => Object.assign(commands, { [cmd]: msg => fn.call(null, msg, bot) })
  };
};

// const { RateLimiter } = require('limiter');

// const limiter = new RateLimiter(1, 'hour', true);

// limiter.removeTokens(1, (err, remainingRequests) => {
//   if (remainingRequests < 0) {
//     return bot.sendMessage(id, `Я отвечал на это не больше часа назад, ${username}`);
//   }
//
//   return handleCommand(command)(msg);
// });
