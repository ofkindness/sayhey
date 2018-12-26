const moment = require('moment');

const { redisClient } = require('../redis');
const Player = require('./player');

const prefix = 'sh:g:';

class Game {
  constructor(chatId) {
    this.chatId = chatId;
    this.client = redisClient;
  }

  async exists() {
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return Boolean(await this.client.exists(`${prefix}${this.chatId}:${formatDate}`));
  }

  play(firstPlayer) {
    const { client, chatId } = this;
    const player = new Player(chatId);
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return player.random(firstPlayer)
      .then((result) => {
        if (result.length === 0) {
          result.push(firstPlayer);
        }

        return client.zincrby(`${prefix}${chatId}:${formatDate}`, 1, result)
          .then(() => ({ username: result.shift() }));
      });
  }

  winner() {
    const { client, chatId } = this;
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return client.zrevrange(`${prefix}${chatId}:${formatDate}`, 0, 0)
      .then(winner => ({ username: winner.shift() }));
  }
}

module.exports = Game;
