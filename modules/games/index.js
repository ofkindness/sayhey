const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');

const { dispatcher } = require('../bot');

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../locales/{{lng}}/{{ns}}.json`
  },
  fallbackLng: 'en',
  ns: ['default'],
  defaultNS: 'default',
  debug: true
};

dispatcher.command('/help', async (req, res) => {
  const { chat: { id: chatId }, from: { language_code: lng } } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  return res.sendMessage(chatId, i18next.t('help'));
});

dispatcher.command('default', async (req, res) => {
  const { chat: { id: chatId }, from: { language_code: lng } } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  return res.sendMessage(chatId, i18next.t('default'));
});
