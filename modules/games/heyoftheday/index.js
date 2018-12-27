const bugsnag = require('@bugsnag/js');
const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const { format, promisify } = require('util');

const { dispatcher } = require('../../bot');
const Game = require('../../models/game');
const Member = require('../../models/member');
const Player = require('../../models/player');
const { getName } = require('../../utils');

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`
  },
  fallbackLng: 'en',
  ns: ['heyoftheday'],
  defaultNS: 'heyoftheday'
};
const { notify } = bugsnag(process.env.BUGSNAG_API_KEY);
const timeout = promisify(setTimeout);

dispatcher.command('/hey', async (req, res) => {
  const { chat: { id: chatId }, from: initiator } = req;
  const { language_code: lng } = initiator;
  const game = new Game(chatId);
  const member = new Member(chatId);
  const player = new Player(chatId);

  try {
    await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, lng));

    if (await player.exists(initiator)) {
      if (await game.exists()) {
        const winner = await game.winner();

        return res.sendMessage(chatId, format(i18next.t('winner'), getName(initiator), getName(winner)));
      }
      // incr award
      await player.incr(initiator);

      const winner = await game.play(getName(initiator));

      await member.add(winner);

      await timeout(2000);

      return res.sendMessage(chatId, format(i18next.t('play'), getName(winner)));
    }
    // add initiator to the game
    await player.add(initiator);
    // welcome message
    return res.sendMessage(chatId, format(i18next.t('welcome'), getName(initiator)));
  } catch (e) {
    return notify(e);
  }
});

dispatcher.command('/heynour', async (req, res) => {
  const { chat: { id: chatId }, from: initiator } = req;
  const { language_code: lng } = initiator;
  const member = new Member(chatId);
  const player = new Player(chatId);

  try {
    await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, lng));

    const results = await member.best();
    const count = await player.count();

    return res.sendMessage(chatId, format(i18next.t('top'), results.join('\n'), count));
  } catch (e) {
    return notify(e);
  }
});
