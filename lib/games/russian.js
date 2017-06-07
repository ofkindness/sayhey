/* eslint no-param-reassign: 0 */
import util from 'util';
import Random from 'random-js';
import bot from '../bot';
import { getName } from '../utils';
// import Member from '../models/member';
// import Player from '../models/player';

const random = new Random(Random.engines.mt19937().autoSeed());

const sendDelayedMessage = (chatId, text, delay) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(bot.sendMessage(chatId, text));
  }, delay);
});

function* generateRound(roundCount, chatId, player) {
  const firstRound = util.format('%s выпивает.', getName(player));
  const thirdRound = util.format('Беркут, к тебе можно в бане спиной поворачиваться! Повторим?\n- Говно вопрос.');
  const shoot = '*Стреляется...';
  const shootPlayer = util.format('%s cтреляется...', getName(player));
  const end = util.format('Молодец, %s.\n%s', getName(player), 'Потешил старика.');

  if (roundCount === 1) {
    yield sendDelayedMessage(chatId, firstRound, 1000);
  }

  if (roundCount === 3) {
    yield sendDelayedMessage(chatId, thirdRound, 1000);
  }
  do {
    if (roundCount % 2 === 0) {
      yield sendDelayedMessage(chatId, shootPlayer, 1000);
    } else {
      yield sendDelayedMessage(chatId, shoot, 1000);
    }
    roundCount += 1;
  } while (random.integer(0, 5) > 0);

  yield sendDelayedMessage(chatId, end, 1000);
}


function* rouleteRound(chatId, player) {
  const init = util.format('На что же нам с тобой сыграть? А, %s?\nНа томаты!',
    (getName(player).indexOf(' ') > 0 ? getName(player) : `@${getName(player)}`));
  const next = 'Вот это как раз, я и хотел тебе предложить.\nВозьми пистолет,';
  const start = 'заряди один патрон и дай мне.';
  const havefun = util.format('Вот так-то.\nПовеселись, %s.\nИ выпей для храбрости.\n', getName(player));

  yield sendDelayedMessage(chatId, init, 500);
  yield sendDelayedMessage(chatId, next, 500);
  // smith && wesson gun
  yield bot.sendSticker(chatId, 'CAADAgADswADTnZECBJLZeHqaMaQAg');
  yield sendDelayedMessage(chatId, start, 1000);
  yield sendDelayedMessage(chatId, havefun, 2500);

  yield* generateRound(1, chatId, player);
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

const roulette = (msg) => {
  const chatId = msg.chat.id;
  const player = msg.from;

  return exec(rouleteRound(chatId, player));
};

export default roulette;
