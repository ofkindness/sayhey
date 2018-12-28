const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Player = require('../../../modules/models/player');

const { expect } = chai;
chai.use(chaiAsPromised);
const player = new Player(-1);

const client = {
  hget: async result => result,
  hincrby: async () => {},
  koka_srandmember: async () => ['throyanec'],
  multi: () => ({
    del: () => ({
      srem: () => ({
        exec: async () => {}
      })
    }),
    hmset: () => ({
      sadd: () => ({
        exec: async () => 1
      })
    })
  }),
  scard: async () => {},
  sismember: async () => 1,
  tomatoholders: async () => {}
};

Object.assign(player, { client });

describe('Player', () => {
  it('add player to the game', () => expect(player.add(1, 'throyanec')).to.eventually.equal(1));

  it('check if the player in a game', () => expect(player.exists(1)).to.eventually.equal(true));

  it('get random player', () => expect(player.random()).to.eventually.deep.equal('throyanec'));
});
