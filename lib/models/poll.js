import client from './redis';

const prefix = 'sh:v:';
const captionPostfix = ':caption';
const optionsPostfix = ':options';
const usersRoot = ':users:';
const votesRoot = ':votes:';

class Poll {
  constructor(chatId, voteId) {
    this.chatId = chatId;
    this.voteId = voteId;
    this.client = client;
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

  getUserResult(userId) {
    return this.client.get(`${this.votePrefix}${usersRoot}${userId}`);
  }

  known() {
    return this.client.exists(this.votePrefix + optionsPostfix);
  }

  vote(optionId, userId) {
    return this.client.multi()
      .hincrby(`${this.votePrefix}${votesRoot}`, optionId, 1)
      .set(`${this.votePrefix}${usersRoot}${userId}`, optionId)
      .exec();
  }
}

export default Poll;
