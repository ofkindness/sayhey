/* eslint camelcase: 0 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getName, declOfNum, getCommand } from '../lib/utils';

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('Utils', () => {
  describe('#getCommand()', () => {
    it('should work with empty message', () => {
      const message = {};
      expect(getCommand(message)).to.equal(null);
    });
    it('should not return command from text', () => {
      const message = {
        text: 'Make Some /say@sayhey_bot Noise @throyanec!',
        entities: [{
          type: 'bot_command',
          offset: 10,
          length: 14
        }]
      };
      expect(getCommand(message)).to.equal(null);
    });
    it('should return command', () => {
      const message = {
        text: '/say@sayhey_bot Make Some Noise @throyanec!',
        entities: [{
          type: 'bot_command',
          offset: 0,
          length: 4
        }]
      };
      expect(getCommand(message)).to.equal('say');
    });
  });

  describe('#getName()', () => {
    it('should extract username first', () => {
      const name = {};
      name.username = 'throyanec';
      expect(getName(name)).to.equal('throyanec');
    });

    it('should combine first_name and last_name', () => {
      const name = {};
      name.first_name = 'First';
      name.last_name = 'Last';
      expect(getName(name)).to.equal('First Last');
    });

    it('should work without last_name', () => {
      const name = {};
      name.first_name = 'd.';
      name.last_name = '';
      expect(getName(name)).to.equal('d. ');
    });
  });

  describe('#declOfNum()', () => {
    it('0', () => {
      const val = 1;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раз');
    });
    it('1', () => {
      const val = 1;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раз');
    });
    it('2', () => {
      const val = 2;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раза');
    });
    it('3', () => {
      const val = 3;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раза');
    });
    it('4', () => {
      const val = 4;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раза');
    });
    it('5', () => {
      const val = 5;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раз');
    });
    it('17', () => {
      const val = 17;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раз');
    });
    it('33', () => {
      const val = 33;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раза');
    });
    it('42', () => {
      const val = 42;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раза');
    });
    it('100500', () => {
      const val = 100500;
      expect(declOfNum(val, ['раз', 'раза'])).to.equal('раз');
    });
  });
});
