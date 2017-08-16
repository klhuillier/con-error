const cError = require('./test-error-0');

describe('ceSequences', () => {
  describe('firstSequence', () => {
    const seq = cError.sequences().first();

    it('seq length', () => {
      expect(seq.length).toEqual(4);
    });

    it('should list C0', () => {
      expect(seq[1].message).toEqual('levelC0');
    });

    it('should list A0', () => {
      expect(seq[2].message).toEqual('levelA0');
    });

    it('should list root0', () => {
      expect(seq[3].message).toEqual('root0');
    });
  });

  describe('allSequences', () => {
    const allSeqs = cError.sequences().all();

    it('sequences count', () => {
      expect(allSeqs.length).toEqual(4);
    });
  });
});
