import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Game from '../../lib/models/game';

const expect = chai.expect;
chai.use(chaiAsPromised);
const game = new Game(-1);

const client = {
  zincrby: () => Promise.resolve('1'),
  zrevrange: () => Promise.resolve(['throyanec'])
};

Object.assign(game, { client });

describe('Game', () => {
  it('start new game', () => {
    const newGame = game.new({
      id: 1,
      username: 'throyanec'
    });

    return expect(newGame).to.eventually.equal('1');
  });

  it('determine the winner', () => {
    const winner = game.winner();
    return expect(winner).to.eventually.deep.equal(['throyanec']);
  });
});
