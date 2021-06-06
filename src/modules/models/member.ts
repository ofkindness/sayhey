const { redisClient } = require('../redis');

const prefix = 'sh:m:';

class Member {
  chatId: string;
  client: any;
  constructor(chatId: string) {
    this.chatId = chatId;
    this.client = redisClient;
  }

  add(member: string) {
    return this.client.zincrby(prefix + this.chatId, 1, member);
  }

  rem(member: string) {
    return this.client.zincrby(prefix + this.chatId, -1, member);
  }

  best() {
    return this.client.zrevrange(prefix + this.chatId, 0, 9, 'WITHSCORES');
  }
}

export default Member;
