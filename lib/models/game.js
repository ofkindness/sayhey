import moment from 'moment';
import client from './redis';
import Player from './player';

const prefix = 'sh:g:';

class Game {
  constructor(chatId) {
    this.chatId = chatId;
    this.client = client;
  }

  is() {
    const formatDate = moment(new Date()).format('YYYYMMDD');
    // unlimit game at Valentine's Day
    if (formatDate.slice(4, 8) === '0214') {
      return Promise.resolve(0);
    }
    return this.client.exists(`${prefix}${this.chatId}:${formatDate}`);
  }

  new(firstPlayer) {
    const player = new Player(this.chatId);
    const formatDate = moment(new Date()).format('YYYYMMDD');

    const c = this.client;
    const chatId = this.chatId;
    return player.random(firstPlayer).then((result) => {
      if (result.length === 0) {
        result.push(firstPlayer);
      }
      return c.zincrby(`${prefix}${chatId}:${formatDate}`, 1, result);
    });
  }

  winner() {
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return this.client.zrevrange(`${prefix}${this.chatId}:${formatDate}`, 0, 0).then((result) => {
      // unlimit game at Valentine's Day
      if (formatDate.slice(4, 8) !== '0214') {
        return Promise.resolve(result);
      }
      return this.client.del(`${prefix}${this.chatId}:${formatDate}`);
    });
  }
}

export default Game;
