const moment = require('moment');

const { redisClient } = require('../redis');

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

  play(playerName) {
    const { client, chatId } = this;
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return client.zincrby(`${prefix}${chatId}:${formatDate}`, 1, playerName);
  }

  winner() {
    const { client, chatId } = this;
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return client.zrevrange(`${prefix}${chatId}:${formatDate}`, 0, 0);
  }
}

module.exports = Game;
