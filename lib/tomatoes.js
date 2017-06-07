/* eslint max-len: ["error", 160] */
import util from 'util';
import Player from './models/player';
import { declOfNum3 } from './utils';
import bot from './bot';

const tomatoes = (msg) => {
  const chatId = msg.chat.id;
  const player = new Player(chatId);
  return player.storage().then((holders) => {
    const result = [];
    let num = 0;
    holders.shift();
    holders.forEach((val, i, arr) => {
      if (i % 2 !== 0 && i !== 0) {
        if (parseInt(val, 10) || 0) {
          num += 1;
          result.push(`${num}). ${arr[i - 1]} ${(parseInt(val, 10) || 0)} ${declOfNum3((parseInt(val, 10) || 0), ['томат', 'томата', 'томатов'])}`);
        }
      }
    });
    const all = util.format('Держатели томатов:\n\n%s', result.join('\n'));
    return bot.sendMessage(chatId, all);
  });
};

export default tomatoes;
