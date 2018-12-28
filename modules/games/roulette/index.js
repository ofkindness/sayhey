const i18next = require('i18next');
const i18nextBackend = require('i18next-node-fs-backend');
const Random = require('random-js');
const { format } = require('util');

const { dispatcher } = require('../../bot');
const { getName } = require('../../utils');

const i18nextOptions = {
  backend: {
    loadPath: `${__dirname}/../../locales/{{lng}}/{{ns}}.json`
  },
  fallbackLng: 'en',
  ns: ['roulette'],
  defaultNS: 'roulette'
};
const random = new Random(Random.engines.mt19937().autoSeed());

const sendDelayedMessage = bot => (chatId, text, delay = 0) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(bot.sendMessage(chatId, text));
  }, delay);
});

const sendDelayedSticker = bot => (chatId, sticker, delay = 0) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(bot.sendSticker(chatId, sticker));
  }, delay);
});

function* generateRound(roundCount, chatId, player, bot) {
  const firstRound = format(i18next.t('firstRound'), getName(player));
  const thirdRound = format(i18next.t('thirdRound'));
  const shoot = i18next.t('shoot');
  const shootPlayer = format(i18next.t('shootPlayer'), getName(player));
  const end = format(i18next.t('end'), getName(player));

  if (roundCount === 1) {
    yield sendDelayedMessage(bot)(chatId, firstRound, 1000);
  }

  if (roundCount === 3) {
    yield sendDelayedMessage(bot)(chatId, thirdRound, 1000);
  }
  do {
    if (roundCount % 2 === 0) {
      yield sendDelayedMessage(bot)(chatId, shootPlayer, 1000);
    } else {
      yield sendDelayedMessage(bot)(chatId, shoot, 1000);
    }
    roundCount += 1; // eslint-disable-line
  } while (random.integer(0, 5) > 0);

  yield sendDelayedMessage(bot)(chatId, end, 1000);
}

function* rouletteRound(chatId, player, bot) {
  const init = format(i18next.t('init'),
    (getName(player).indexOf(' ') > 0 ? getName(player) : `@${getName(player)}`));
  const next = i18next.t('next');
  const start = i18next.t('start');
  const havefun = format(i18next.t('havefun'), getName(player));

  yield sendDelayedMessage(bot)(chatId, init, 500);
  yield sendDelayedMessage(bot)(chatId, next, 500);
  // smith && wesson gun
  yield sendDelayedSticker(bot)(chatId, 'CAADAgADswADTnZECBJLZeHqaMaQAg');
  yield sendDelayedMessage(bot)(chatId, start, 1000);
  yield sendDelayedMessage(bot)(chatId, havefun, 2500);

  yield* generateRound(1, chatId, player, bot);
}

const exec = (generator, yieldValue) => {
  const next = generator.next(yieldValue);
  if (!next.done) {
    return next.value.then(
      result => exec(generator, result),
      err => generator.throw(err)
    );
  }
  // обработаем результат return из генератора
  return next.value;
};

dispatcher.command('/roulette', async (req, res) => {
  const { chat: { id: chatId }, from: player } = req;
  const { language_code: lng } = player;
  await i18next.use(i18nextBackend).init(Object.assign(i18nextOptions, { lng }));

  return exec(rouletteRound(chatId, player, res));
});
