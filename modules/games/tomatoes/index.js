const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');

const { Dispatcher } = require('../../dispatcher');
const { notify } = require('../../logger');

const dispatcher = Dispatcher();
const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`
  },
  fallbackLng: 'en',
  ns: ['tomatoes'],
  defaultNS: 'tomatoes',
  debug: true
};
const Player = require('../../models/player');

dispatcher.command('/tomatoes', async (req, res) => {
  const { chat: { id: chatId }, from: { language_code: lng } } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  const player = new Player(chatId);

  try {
    const result = await player.storage();
    const holders = [];
    let num = 0;
    result.shift();
    result.forEach((val, i, arr) => {
      if (i % 2 !== 0 && i !== 0) {
        num += 1;
        holders.push(i18next.t('holder', {
          num,
          username: arr[i - 1],
          count: parseInt(val, 10) || 0
        }));
      }
    });

    return res.sendMessage(chatId,
      i18next.t('holders', { holders: holders.join('\n') }));
  } catch (e) {
    return notify(e);
  }
});
