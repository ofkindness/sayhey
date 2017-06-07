import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Player from '../../lib/models/player';

const expect = chai.expect;
chai.use(chaiAsPromised);
const player = new Player(-1);

const client = {
  hget: result => Promise.resolve(result),
  hincrby: () => Promise.resolve(),
  koka_srandmember: () => Promise.resolve(['throyanec']),
  multi: () => ({
    del: () => ({
      srem: () => ({
        exec: () => Promise.resolve()
      })
    }),
    hmset: () => ({
      sadd: () => ({
        exec: () => Promise.resolve(1)
      })
    })
  }),
  scard: () => Promise.resolve(),
  sismember: () => Promise.resolve(1),
  tomatoholders: () => Promise.resolve()
};

Object.assign(player, { client });

describe('Player', () => {
  it('add player to the game', () => {
    const add = player.add({
      username: 'throyanec'
    });
    return expect(add).to.eventually.equal(1);
  });

  it('check if the player in a game', () => {
    const is = player.is({
      username: 'throyanec'
    });
    return expect(is).to.eventually.equal(1);
  });

  it('get random player', () => {
    const random = player.random();
    return expect(random).to.eventually.deep.equal(['throyanec']);
  });
});
