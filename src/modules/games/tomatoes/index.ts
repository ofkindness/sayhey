import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';

import Dispatcher from '../../dispatcher';

const dispatcher = new Dispatcher();

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`,
  },
  fallbackLng: 'en',
  ns: ['tomatoes'],
  defaultNS: 'tomatoes',
  debug: true,
};
const Player = require('../../models/player');

dispatcher.command('/tomatoes', async (req: any, res: any) => {
  const {
    chat: { id: chatId },
    from: { language_code: lng },
  } = req;

  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  const player = new Player(chatId);

  try {
    const result = await player.storage();
    const holders: string[] = [];
    let num = 0;
    result.shift();
    result.forEach((val: string, i: number, arr: string[]) => {
      if (i % 2 !== 0 && i !== 0) {
        num += 1;
        holders.push(
          i18next.t('holder', {
            num,
            username: arr[i - 1],
            count: parseInt(val, 10) || 0,
          }),
        );
      }
    });

    return res.sendMessage(chatId, i18next.t('holders', { holders: holders.join('\n') }));
  } catch (e) {
    return console.error(e);
  }
});
