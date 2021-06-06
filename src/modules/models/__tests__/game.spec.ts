import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Game from '../game';

const { expect } = chai;
chai.use(chaiAsPromised);

const game = new Game('-1');

const client = {
  exists: async () => 0,
  zincrby: async () => '1',
  zrevrange: async () => 'throyanec',
};

Object.assign(game, { client });

describe('Game', () => {
  it('check if game is played', () => expect(game.exists()).to.eventually.equal(false));

  it('play new game', () => expect(game.play('throyanec')).to.eventually.equal('1'));

  it('get the current winner', () => expect(game.winner()).to.eventually.deep.equal('throyanec'));
});
