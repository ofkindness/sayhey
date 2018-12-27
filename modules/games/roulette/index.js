const Random = require('random-js');
const { format } = require('util');

const { dispatcher } = require('../../bot');
const { getName } = require('../../utils');

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
  const firstRound = format('%s выпивает.', getName(player));
  const thirdRound = format('Беркут, к тебе можно в бане спиной поворачиваться! Повторим?\n- Говно вопрос.');
  const shoot = '*Стреляется...';
  const shootPlayer = format('%s cтреляется...', getName(player));
  const end = format('Молодец, %s.\n%s', getName(player), 'Потешил старика.');

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
  const init = format('На что же нам с тобой сыграть? А, %s?\nНа томаты!',
    (getName(player).indexOf(' ') > 0 ? getName(player) : `@${getName(player)}`));
  const next = 'Вот это как раз, я и хотел тебе предложить.\nВозьми пистолет,';
  const start = 'заряди один патрон и дай мне.';
  const havefun = format('Вот так-то.\nПовеселись, %s.\nИ выпей для храбрости.\n', getName(player));

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

dispatcher.command('/roulette', (req, res) => {
  const { chat: { id: chatId }, from: player } = req;
  return exec(rouletteRound(chatId, player, res));
});
