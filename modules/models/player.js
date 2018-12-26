const { getId, getName } = require('../utils');
const { redisClient } = require('../redis');

const prefix = 'sh:p:';
const playerPrefix = 'u:';

class Player {
  constructor(chatId) {
    this.chatId = chatId;
    this.client = redisClient;
  }

  add(player) {
    const { language_code: languageCode } = player;
    return this.client.multi()
      .hmset(playerPrefix + getId(player), 'username', getName(player), 'language_code', languageCode)
      .sadd(prefix + this.chatId, playerPrefix + getId(player))
      .exec();
  }

  count() {
    return this.client.scard(prefix + this.chatId);
  }

  // TODO prop
  storage() {
    return this.client.tomatoholders(prefix + this.chatId, 100);
  }

  incr(player) {
    return this.client.hincrby(playerPrefix + getId(player), 'tomatos', 1);
  }

  del(player) {
    return this.client.multi()
      .del(playerPrefix + getId(player))
      .srem(prefix + this.chatId, playerPrefix + getId(player))
      .exec();
  }

  async exists(player) {
    return Boolean(await this.client.sismember(prefix + this.chatId, playerPrefix + getId(player)));
  }

  random() {
    const c = this.client;
    return c.koka_srandmember(prefix + this.chatId, 1)
      .then(result => c.hget(result.pop(), 'username').then(r => [r]));
  }
}


module.exports = Player;
