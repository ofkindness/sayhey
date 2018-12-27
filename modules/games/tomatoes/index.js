const bugsnag = require('@bugsnag/js');
const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const { format } = require('util');

const { dispatcher } = require('../../bot');

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`
  },
  fallbackLng: 'en',
  ns: ['default'],
  defaultNS: 'default',
  debug: true
};
const Player = require('../../models/player');
const { declOfNum3 } = require('../../utils');

const { notify } = bugsnag(process.env.BUGSNAG_API_KEY);

dispatcher.command('/tomatoes', async (req, res) => {
  const { chat: { id: chatId }, from: { language_code: lng } } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, lng));

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
    const all = format(i18next.t('holders'), result.join('\n'));
    return res.sendMessage(chatId, all);
  } catch (e) {
    return notify(e);
  }
});
