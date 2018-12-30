const bot = require('./bot');
const { makeChoice } = require('./poll/choice');

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

const handleChoice = (msg, res) => {
  const messageType = () => 'poll';

  const { message_id: messageId } = msg;
  switch (messageType(messageId)) {
    case 'poll':
    default:
      return makeChoice(msg, res);
  }
};

class Dispatcher {
  constructor() {
    this.commands = {};
    this.bot = bot();

    this.bot.on('message', (msg) => {
      const command = parseCommand(msg);

      if (command && this.commands[command]) {
        return this.commands[command](msg);
      }

      // default command
      return this.commands.default(msg);
    });

    this.bot.on('callback_query', msg => handleChoice(msg, this.bot));
  }

  dispatch(msg) {
    this.bot.processUpdate(msg);
  }

  command(cmd, fn) {
    Object.assign(this.commands, { [cmd]: msg => fn.call(null, msg, this.bot) });
  }
}

module.exports = (() => {
  let instance;

  return {
    Dispatcher: () => {
      if (instance == null) {
        instance = new Dispatcher();
        instance.constructor = null;
      }
      return instance;
    }
  };
})();
