import redisClient from '../redis';

const prefix = 'sh:p:';
const playerPrefix = 'u:';

class Player {
  chatId: string;
  client: any;
  constructor(chatId: string) {
    this.chatId = chatId;
    this.client = redisClient;
  }

  add(playerId: string, playerName: string) {
    const { client, chatId } = this;
    return client
      .multi()
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

  incr(playerId: string) {
    return this.client.hincrby(playerPrefix + playerId, 'tomatos', 1);
  }

  del(playerId: string) {
    return this.client
      .multi()
      .del(playerPrefix + playerId)
      .srem(prefix + this.chatId, playerPrefix + playerId)
      .exec();
  }

  async exists(playerId: string) {
    return Boolean(await this.client.sismember(prefix + this.chatId, playerPrefix + playerId));
  }

  random() {
    const { client, chatId } = this;
    return client
      .koka_srandmember(prefix + chatId, 1)
      .then((result: string[]) => client.hget(result.pop(), 'username'));
  }
}

export default Player;
