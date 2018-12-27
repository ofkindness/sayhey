const bugsnag = require('@bugsnag/js');
const { format } = require('util');

const { dispatcher } = require('../../bot');
const Player = require('../../models/player');
const { declOfNum3 } = require('../../utils');

const { notify } = bugsnag(process.env.BUGSNAG_API_KEY);

dispatcher.command('/tomatoes', async (req, res) => {
  const { chat: { id: chatId } } = req;
  const player = new Player(chatId);

  try {
    const holders = await player.storage();
    const result = [];
    let num = 0;
    holders.shift();
    holders.forEach((val, i, arr) => {
      if (i % 2 !== 0 && i !== 0) {
        if (parseInt(val, 10) || 0) {
          num += 1;
          result.push(
            `${num}) ${arr[i - 1]} ${(parseInt(val, 10) || 0)} ${declOfNum3((parseInt(val, 10) || 0), ['томат', 'томата', 'томатов'])}`
          );
        }
      }
    });
    const all = format('Держатели томатов:\n\n%s', result.join('\n'));
    return res.sendMessage(chatId, all);
  } catch (e) {
    return notify(e);
  }
});
