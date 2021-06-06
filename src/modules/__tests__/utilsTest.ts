import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getName } from '../utils';

const { expect } = chai;
chai.use(chaiAsPromised);

describe('Utils', () => {
  describe('#getName()', () => {
    it('should extract username first', () =>
      expect(getName({ username: 'throyanec', first_name: '', last_name: '' })).to.equal('throyanec'));

    it('should combine first_name and last_name', () =>
      expect(getName({ first_name: 'First', last_name: 'Last' })).to.equal('First Last'));

    it('should work without last_name', () => expect(getName({ first_name: 'd.', last_name: '' })).to.equal('d. '));
  });
});
