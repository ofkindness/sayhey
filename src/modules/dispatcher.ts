const bot = require('../../legacy/modules/bot');
const { makeChoice } = require('../../legacy/modules/poll/choice');

const parseCommand = (msg: any) => {
  const { entities = [], text = '' } = msg;

  if (Array.isArray(entities) && entities.length > 0) {
    const { length, offset, type } = entities.shift();

    if (type === 'bot_command') {
      return text.slice(offset, text.indexOf('@') > 0 ? text.indexOf('@') : length);
    }
  }

  return null;
};

const handleChoice = (msg: any, res: any) => {
  const messageType = () => 'poll';

  // const { message_id: messageId } = msg;
  switch (messageType()) {
    case 'poll':
    default:
      return makeChoice(msg, res);
  }
};

class Dispatcher {
  commands: {
    [key: string]: any;
  };
  bot: any;

  constructor() {
    this.commands = {};
    this.bot = bot();

    this.bot.on('message', (msg: string) => {
      const command = parseCommand(msg);

      if (command && this.commands[command]) {
        return this.commands[command](msg);
      }

      // default command
      return this.commands.default(msg);
    });

    this.bot.on('callback_query', (msg: string) => handleChoice(msg, this.bot));
  }

  dispatch(msg: string) {
    this.bot.processUpdate(msg);
  }

  command(cmd: string, fn: any) {
    Object.assign(this.commands, { [cmd]: (msg: string) => fn.call(null, msg, this.bot) });
  }
}

export default Dispatcher;
