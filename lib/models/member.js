import { getName } from '../utils';
import client from './redis';

const prefix = 'sh:m:';

class Member {
  constructor(chatId) {
    this.chatId = chatId;
    this.client = client;
  }

  add(member) {
    return this.client.zincrby(prefix + this.chatId, 1, getName(member));
  }

  rem(member) {
    return this.client.zincrby(prefix + this.chatId, -1, getName(member));
  }

  best() {
    return this.client.zrevrange(prefix + this.chatId, 0, 9, 'WITHSCORES');
  }
}

export default Member;
