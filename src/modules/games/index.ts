import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';

import Dispatcher from '../dispatcher';

const dispatcher = new Dispatcher();

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../locales/{{lng}}/{{ns}}.json`,
  },
  fallbackLng: 'en',
  ns: ['default'],
  defaultNS: 'default',
  debug: true,
};

dispatcher.command('/help', async (req: any, res: any) => {
  const {
    chat: { id: chatId },
    from: { language_code: lng },
  } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  return res.sendMessage(chatId, i18next.t('help'));
});

dispatcher.command('default', async (req: any, res: any) => {
  const {
    chat: { id: chatId },
    from: { language_code: lng },
  } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  return res.sendMessage(chatId, i18next.t('default'));
});
