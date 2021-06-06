import moment from 'moment';

import redisClient from '../redis';

const prefix = 'sh:g:';

class Game {
  chatId: string;
  client: any;
  constructor(chatId: string) {
    this.chatId = chatId;
    this.client = redisClient;
  }

  async exists() {
    const formatDate = moment(new Date()).format('YYYYMMDD');

    return Boolean(await this.client.exists(`${prefix}${this.chatId}:${formatDate}`));
  }

  play(playerName: string) {
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

export default Game;
