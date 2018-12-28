const { redisClient } = require('../redis');

const prefix = 'sh:p:';
const playerPrefix = 'u:';

class Player {
  constructor(chatId) {
    this.chatId = chatId;
    this.client = redisClient;
  }

  add(playerId, playerName) {
    const { client, chatId } = this;
    return client.multi()
      .hmset(playerPrefix + playerId, 'username', playerName)
      .sadd(prefix + chatId, playerPrefix + playerId)
      .exec();
  }

  count() {
    return this.client.scard(prefix + this.chatId);
  }

  storage() {
    return this.client.tomatoholders(prefix + this.chatId, 100);
  }

  incr(playerId) {
    return this.client.hincrby(playerPrefix + playerId, 'tomatos', 1);
  }

  del(playerId) {
    return this.client.multi()
      .del(playerPrefix + playerId)
      .srem(prefix + this.chatId, playerPrefix + playerId)
      .exec();
  }

  async exists(playerId) {
    return Boolean(await this.client.sismember(prefix + this.chatId, playerPrefix + playerId));
  }

  random() {
    const { client, chatId } = this;
    return client.koka_srandmember(prefix + chatId, 1)
      .then(result => client.hget(result.pop(), 'username'));
  }
}


module.exports = Player;
