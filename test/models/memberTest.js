import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Member from '../../lib/models/member';

const expect = chai.expect;
chai.use(chaiAsPromised);
const member = new Member(-1);

const client = {
  zincrby: () => Promise.resolve(1),
  zrevrange: () => Promise.resolve(['throyanec', '1'])
};

Object.assign(member, { client });

describe('Member', () => {
  it('add member to top', () => {
    const add = member.add({
      username: 'throyanec'
    });
    return expect(add).to.eventually.equal(1);
  });

  it('get best member', () => {
    const best = member.best();
    return expect(best).to.eventually.deep.equal(['throyanec', '1']);
  });
});
