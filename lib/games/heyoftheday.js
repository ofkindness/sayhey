import util from 'util';
import bot from '../bot';
import Game from '../models/game';
import Member from '../models/member';
import Player from '../models/player';
import { getName, declOfNum } from '../utils';

const text = {
  cheat: [''],
  invite: [''],
  welcomeFail: ['OK! Ты уже участвуешь в игре Эгегей Дня'],
  farewell: ['OK! Ты уже участвуешь в игре Эгегей Дня'],
  heroes: ['Эгегей Топ-10:\n\n%s\n\nВсего участников - %s'],
  play: ['', 'Кажется, Эгегей дня - %s'],
  result: ['Согласно моей информации, по результатам сегодняшнего розыгрыша Эгегей дня - %s'],
  top: [''],
  welcome: ['OK! Ты теперь участвуешь в игре Эгегей Дня, %s']
};

const playResults = text.play.shift();
const allPlayers = text.heroes.shift();

const updateGame = (msg) => {
  const chatId = msg.chat.id;
  const member = new Member(chatId);
  return member.add(msg.from)
    .then(() => {
      const winner = getName(msg.from) || '';
      return bot.sendMessage(chatId, util.format(playResults, (winner.indexOf(' ') > 0 ? winner : `@${winner}`)));
    });
};

const play = (msg) => {
  const chatId = msg.chat.id;
  const game = new Game(chatId);
  const m = msg;
  return game.new(getName(msg.from)).then((result) => {
    if (parseInt(result, 10) > 0) {
      return game.winner().then((res) => {
        const winner = res.shift();
        setTimeout(() => {
          m.from.username = winner;
          return updateGame(m);
        }, 3000);
      // });
      });
    }
    return Promise.reject(new Error('No game'));
  });
};

const heynour = (msg) => {
  const chatId = msg.chat.id;
  const member = new Member(chatId);
  const player = new Player(chatId);
  return member.best().then((members) => {
    const result = [];
    let num = 0;
    members.forEach((val, i, arr) => {
      if (i % 2 !== 0 && i !== 0) {
        num += 1;
        result.push(`${num}. ${arr[i - 1]} ${val} ${declOfNum((parseInt(val, 10) || 0), ['раз', 'раза'])}`);
      }
    });
    if (result.length > 0) {
      return player.count().then((count) => {
        const all = util.format(allPlayers, result.join('\n'), count);
        return bot.sendMessage(chatId, all);
      });
    }
    return bot.sendMessage(chatId, 'Нет результатов');
  });
};

const hey = (msg) => {
  const chatId = msg.chat.id;
  const game = new Game(chatId);
  const player = new Player(chatId);
  return game.is().then(
    (result) => {
      if (parseInt(result, 10) > 0) {
        return heynour(msg);
      }
      return player.incr(msg.from).then(() => play(msg));
    });
};

export { hey, heynour };
