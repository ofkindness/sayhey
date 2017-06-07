import _ from 'lodash';
import util from 'util';
import bot from './bot';

const say = (msg) => {
  const input = (msg.text || '').split(' ');
  input.shift();

  const usernames = _.filter(input, str => /@/.test(str));

  const words = _.filter(input, str => !/@/.test(str));

  // invite template message
  let text = ' ';

  if (usernames.length > 0) {
    if (words.length > 0) {
      words.push('%s');
      text = words.join(' ');
    }
    text = util.format(text, usernames.join(' '));
  } else {
    text = ' ';
  }

  return bot.sendMessage(msg.chat.id, text, {
    parse_mode: 'HTML'
  });
};

export default say;
