const { redisClient } = require('../redis');

const prefix = 'sh:v:';
const captionPostfix = ':caption';
const optionsPostfix = ':options';
const usersRoot = ':users:';
const votesRoot = ':votes:';

class Poll {
  constructor(chatId, voteId) {
    this.chatId = chatId;
    this.voteId = voteId;
    this.client = redisClient;
    this.votePrefix = `${prefix}${chatId}:${voteId}`;
  }

  create(voteQuestion, voteOptions) {
    return this.client.multi()
      .set(this.votePrefix + captionPostfix, voteQuestion)
      .hmset(this.votePrefix + optionsPostfix, voteOptions)
      .exec();
  }

  getOption(optionId) {
    return this.client.hget(this.votePrefix + optionsPostfix, optionId);
  }

  getOptions() {
    return this.client.hgetall(this.votePrefix + optionsPostfix);
  }

  getQuestion() {
    return this.client.get(this.votePrefix + captionPostfix);
  }

  getResults() {
    return this.client.hgetall(`${this.votePrefix}${votesRoot}`);
  }

  async getUserResult(userId) {
    const optionId = parseInt(await this.client.get(`${this.votePrefix}${usersRoot}${userId}`), 10);
    return { optionId, userNotVoted: Number.isNaN(optionId) };
  }

  async known() {
    return Boolean(await this.client.exists(this.votePrefix + optionsPostfix));
  }

  vote(optionId, userId) {
    return this.client.multi()
      .hincrby(`${this.votePrefix}${votesRoot}`, optionId, 1)
      .set(`${this.votePrefix}${usersRoot}${userId}`, optionId)
      .exec();
  }
}

module.exports = Poll;
