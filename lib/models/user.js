import crypto from 'crypto';
import client from './redis';

const prefix = 'u:';

class User {
  constructor(user) {
    const sha1 = crypto.createHash('sha1');

    this.userId = sha1.update(user.id.toString()) ? sha1.digest('hex').slice(0, 18) : '';
    this.userName = user.username ? user.username : `${user.first_name} ${(user.last_name || '')}`;
    this.client = client;
  }

  save() {
    return client.hmset(prefix + this.userId, 'username', this.userName, 'locale', 'ru_RU');
  }
}

export default User;
