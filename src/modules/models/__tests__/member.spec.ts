import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Member from '../member';

const { expect } = chai;
chai.use(chaiAsPromised);
const member = new Member('-1');

const client = {
  zincrby: async () => 1,
  zrevrange: async () => ['throyanec', '1'],
};

Object.assign(member, { client });

describe('Member', () => {
  it('add member to top', () => expect(member.add('throyanec')).to.eventually.equal(1));

  it('get best member', () => expect(member.best()).to.eventually.deep.equal(['throyanec', '1']));
});
