const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Poll = require('../../../modules/models/poll');

const { expect } = chai;
chai.use(chaiAsPromised);

const chatId = 1;
const voteId = 1;
const poll = new Poll(chatId, voteId);

const client = {
  get: async (key) => {
    switch (key) {
      case 'sh:v:1:1:users:1':
        return null;
      default:
    }
    return 'Написать тесты к поллам?';
  },
  exists: async () => 1,
  hget: async () => 'Напиться',
  hgetall: async (key) => {
    switch (key) {
      case 'sh:v:1:1:options':
        return {
          0: 'Да',
          1: 'Нет',
          2: 'Напиться'
        };
      default:
    }
    return {};
  },
  multi: () => ({
    hincrby: () => ({
      set: () => ({
        exec: () => Promise.resolve([[null, 0], [null, 'OK']])
      })
    }),
    set: () => ({
      hmset: () => ({
        exec: () => Promise.resolve([[null, 'OK'], [null, 'OK']])
      })
    })
  }),
};

Object.assign(poll, { client });

describe('Poll', () => {
  it('create new poll', () => {
    const voteQuestion = 'Написать тесты к поллам?';
    const voteOptions = {
      0: 'Да',
      1: 'Нет',
      2: 'Напиться'
    };
    const create = poll.create(voteQuestion, voteOptions);
    return expect(create).to.eventually.deep.equal([[null, 'OK'], [null, 'OK']]);
  });

  it('get certain option', () => {
    const getOption = poll.getOption(2);
    return expect(getOption).to.eventually.deep.equal('Напиться');
  });

  it('get all options', () => {
    const getOptions = poll.getOptions();
    return expect(getOptions).to.eventually.deep.equal({
      0: 'Да',
      1: 'Нет',
      2: 'Напиться'
    });
  });

  it('get question', () => {
    const getQuestion = poll.getQuestion();
    return expect(getQuestion).to.eventually.deep.equal('Написать тесты к поллам?');
  });

  it('get results', () => {
    const getResults = poll.getResults();
    return expect(getResults).to.eventually.deep.equal({});
  });

  it('get user results', async () => {
    const { userNotVoted } = await poll.getUserResult(1);
    expect(userNotVoted).to.deep.equal(true);
  });

  it('known poll', () => {
    const known = poll.known();
    return expect(known).to.eventually.deep.equal(true);
  });

  it('vote poll', () => {
    const vote = poll.vote();
    return expect(vote).to.eventually.deep.equal([[null, 0], [null, 'OK']]);
  });
});
