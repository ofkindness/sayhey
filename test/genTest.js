/* eslint no-param-reassign: 0 */
import Random from 'random-js';

const random = new Random(Random.engines.mt19937().autoSeed());

const sendDelayedMessage = (chatId, text, delay) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(text);
  }, delay);
});

const chatId = 1;
const shootPlayer = 'shoot Player';
const shoot = 'shoot Master';
const end = 'end of rounds';

function* generateRound(roundCount) {
  if (roundCount === 1) {
    yield sendDelayedMessage(chatId, 'first round', 2000);
  }
  do {
    if (roundCount % 2 === 0) {
      yield sendDelayedMessage(chatId, shootPlayer, 2000);
    } else {
      yield sendDelayedMessage(chatId, shoot, 2000);
    }
    roundCount += 1;
  } while (random.integer(0, 5) > 0);

  yield sendDelayedMessage(chatId, end, 2000);
}


function* rouleteRound() {
  yield sendDelayedMessage(chatId, 'start of rounds', 1000);

  yield* generateRound(1);
}

// const rounds = rouleteRound();

const exec = (generator, yieldValue) => {
  const next = generator.next(yieldValue);
  if (!next.done) {
    return next.value.then(
      result => exec(generator, result),
      err => generator.throw(err)
    );
  }

  return next.value;
};

exec(rouleteRound());
