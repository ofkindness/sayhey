import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import Poll from '../../lib/models/poll';

chai.use(chaiAsPromised);
const expect = chai.expect;

const chatId = 1;
const voteId = 1;
const poll = new Poll(chatId, voteId);

const client = {
  get: (key) => {
    switch (key) {
      case `sh:v:1:1:users:1`:
        return Promise.resolve(null);
      default:

    }
    return Promise.resolve('Написать тесты к поллам?');
  },
  exists: () => Promise.resolve(1),
  hget: () => Promise.resolve('Напиться'),
  hgetall: (key) => {
    switch (key) {
      case 'sh:v:1:1:options':
        return Promise.resolve({
          0: 'Да',
          1: 'Нет',
          2: 'Напиться'
        });
      default:
    }
    return Promise.resolve({});
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

  it('get user results', () => {
    const getUserResult = poll.getUserResult(1);
    return expect(getUserResult).to.eventually.deep.equal(null);
  });

  it('known poll', () => {
    const known = poll.known();
    return expect(known).to.eventually.deep.equal(1);
  });

  it('vote poll', () => {
    const vote = poll.vote();
    return expect(vote).to.eventually.deep.equal([[null, 0], [null, 'OK']]);
  });
});
