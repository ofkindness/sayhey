const find = require('lodash.find');
const { format, promisify } = require('util');

const Game = require('../../models/game');
const Member = require('../../models/member');
const Player = require('../../models/player');
const { dispatcher } = require('../../bot');
const { getName } = require('../../utils');

const timeout = promisify(setTimeout);

const messages = [{
  play: [{ text: 'Winner today is %s' }],
  top: [{ text: 'TOP 10:\n\n%s\n\nAll players - %s', }],
  welcome: [{ text: 'Welcome to the game %s' }],
  winner: [{ text: 'Hey, %s, the winner for today is %s' }]
}];

dispatcher.command('/hey', async (req, res) => {
  const { chat: { id: chatId }, from: initiator } = req;
  const game = new Game(chatId);
  const member = new Member(chatId);
  const player = new Player(chatId);

  try {
    if (await player.exists(initiator)) {
      if (await game.exists()) {
        const winner = await game.winner();

        return res.sendMessage(chatId, format(find(messages, 'winner').winner[0].text, getName(initiator), getName(winner)));
      }
      // incr award
      await player.incr(initiator);

      const winner = await game.play(getName(initiator));

      await member.add(winner);

      await timeout(2000);

      return res.sendMessage(chatId, format(find(messages, 'play').play[0].text, getName(winner)));
    }
    // add initiator to the game
    await player.add(initiator);
    // welcome message
    return res.sendMessage(chatId, format(find(messages, 'welcome').welcome[0].text, getName(initiator)));
  } catch (e) {
    console.error(e);
  }

  return null;
});

dispatcher.command('/heynour', async (req, res) => {
  const { chat: { id: chatId }, from: { username } } = req;
  const member = new Member(chatId);
  const player = new Player(chatId);

  const results = await member.best();

  if (results.length > 0) {
    const count = await player.count();
    return res.sendMessage(chatId, format(find(messages, 'top').top[0].text, results.join('\n'), count));
  }

  return res.sendMessage(chatId, `Heynour, ${username}`);
});
