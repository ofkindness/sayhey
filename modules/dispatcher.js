const { makeChoice } = require('./poll/choice');

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

const messageType = () => 'poll';

const handleChoice = (msg, bot) => {
  const { message_id: messageId } = msg;
  switch (messageType(messageId)) {
    case 'poll':
    default:
      return makeChoice(msg, bot);
  }
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
  bot.on('callback_query', msg => handleChoice(msg, bot));

  return {
    dispatch: msg => bot.processUpdate(msg),
    command: (cmd, fn) => Object.assign(commands, { [cmd]: msg => fn.call(null, msg, bot) })
  };
};
