import i18next from 'i18next';
import i18nextBackend from 'i18next-node-fs-backend';
import { promisify } from 'util';

import Dispatcher from '../../dispatcher';

import limiter from '../../limiter';
import Game from '../../models/game';
import Member from '../../models/member';
import Player from '../../models/player';
import { getName, getId } from '../../utils';

const notify = console.error;

const dispatcher = new Dispatcher();
const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`,
  },
  fallbackLng: 'en',
  ns: ['heyoftheday'],
  defaultNS: 'heyoftheday',
};
const timeout = promisify(setTimeout);

dispatcher.command('/hey', async (req: any, res: any) => {
  const {
    chat: { id: chatId },
    from,
    from: { language_code: lng },
  } = req;
  const game = new Game(chatId);
  const member = new Member(chatId);
  const player = new Player(chatId);

  try {
    await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

    if (await player.exists(getId(from))) {
      if (await game.exists()) {
        return res.sendMessage(chatId, i18next.t('winner', { winner: await game.winner() }));
      }
      // incr award
      await player.incr(getId(from));

      const winner = await player.random();

      await game.play(winner);

      await member.add(winner);

      await timeout(1000);

      return res.sendMessage(chatId, i18next.t('play', { winner }));
    }
    // add initiator to the game
    await player.add(getId(from), getName(from));
    // welcome message
    return res.sendMessage(chatId, i18next.t('welcome', { username: getName(from) }));
  } catch (e) {
    return notify(e);
  }
});

dispatcher.command('/heynour', async (req: any, res: any) => {
  const {
    chat: { id: chatId },
    from,
    from: { language_code: lng },
  } = req;

  try {
    await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

    if (limiter(chatId)) {
      const member = new Member(chatId);
      const player = new Player(chatId);

      const results = await member.best();
      const count = await player.count();

      const players: any[] = [];
      let num = 0;
      results.forEach((val: string, i: number, arr: any[]) => {
        if (i % 2 !== 0 && i !== 0) {
          num += 1;
          players.push(
            i18next.t('player', {
              num,
              username: arr[i - 1],
              count: parseInt(val, 10) || 0,
            }),
          );
        }
      });

      return res.sendMessage(chatId, i18next.t('top', { players: players.join('\n'), count }));
    }

    return res.sendMessage(chatId, i18next.t('limit', { username: getName(from) }));
  } catch (e) {
    return notify(e);
  }
});
