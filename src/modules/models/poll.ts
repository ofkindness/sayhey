import redisClient from '../redis';

const prefix = 'sh:v:';
const captionPostfix = ':caption';
const optionsPostfix = ':options';
const usersRoot = ':users:';
const votesRoot = ':votes:';

class Poll {
  chatId: any;
  voteId: any;
  client: any;
  votePrefix: string;

  constructor(chatId: string, voteId: string) {
    this.chatId = chatId;
    this.voteId = voteId;
    this.client = redisClient;
    this.votePrefix = `${prefix}${chatId}:${voteId}`;
  }

  create(voteQuestion: string, voteOptions: any) {
    return this.client
      .multi()
      .set(this.votePrefix + captionPostfix, voteQuestion)
      .hmset(this.votePrefix + optionsPostfix, voteOptions)
      .exec();
  }

  getOption(optionId: string) {
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

  async getUserResult(userId: string) {
    const optionId = parseInt(await this.client.get(`${this.votePrefix}${usersRoot}${userId}`), 10);
    return { optionId, userNotVoted: Number.isNaN(optionId) };
  }

  async known() {
    return Boolean(await this.client.exists(this.votePrefix + optionsPostfix));
  }

  vote(optionId: string, userId: string) {
    return this.client
      .multi()
      .hincrby(`${this.votePrefix}${votesRoot}`, optionId, 1)
      .set(`${this.votePrefix}${usersRoot}${userId}`, optionId)
      .exec();
  }
}

export default Poll;
