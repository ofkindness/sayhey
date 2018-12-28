const bugsnag = require('@bugsnag/js');
const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const { format, promisify } = require('util');

const { dispatcher } = require('../../bot');
const Game = require('../../models/game');
const Member = require('../../models/member');
const Player = require('../../models/player');
const { getName, getId } = require('../../utils');

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
    await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

    const initiatorId = getId(initiator);
    const initiatorName = getName(initiator);

    if (await player.exists(initiatorId)) {
      if (await game.exists()) {
        const winnerName = await game.winner();

        return res.sendMessage(chatId, format(i18next.t('winner'), initiatorName, winnerName));
      }
      // incr award
      await player.incr(initiatorId);

      const winnerName = await player.random();

      await game.play(winnerName);

      await member.add(winnerName);

      await timeout(2000);

      return res.sendMessage(chatId, format(i18next.t('play'), winnerName));
    }
    // add initiator to the game
    await player.add(initiatorId, initiatorName);
    // welcome message
    return res.sendMessage(chatId, format(i18next.t('welcome'), initiatorName));
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
    await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

    const results = await member.best();
    const count = await player.count();

    return res.sendMessage(chatId, format(i18next.t('top'), results.join('\n'), count));
  } catch (e) {
    return notify(e);
  }
});
