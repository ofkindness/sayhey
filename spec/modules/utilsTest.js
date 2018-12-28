const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { getName } = require('../../modules/utils');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('Utils', () => {
  describe('#getName()', () => {
    it('should extract username first',
      () => expect(getName({ username: 'throyanec' })).to.equal('throyanec'));

    it('should combine first_name and last_name',
      () => expect(getName({ first_name: 'First', last_name: 'Last' })).to.equal('First Last'));

    it('should work without last_name',
      () => expect(getName({ first_name: 'd.', last_name: '' })).to.equal('d. '));
  });
});
