const resolveCeArgs = require('../src/resolve-ce-args');

const e0 = new Error();
const e1 = new Error();
const e2 = new Error();
const emptyObj = {};
const fullObj = {
  id: 9847,
  name: 'Test Supplier',
  permissions: ['read_event', 'submit_bids'],
};
const emptyMsg = '';
const fullMsg = 'a 500 error was received from the submit bids service';

describe('resolveCeArgs', () => {
  describe('all provided', () => {
    it('should accept all', () => {
      expect(resolveCeArgs([e0, fullMsg, fullObj])).toEqual({
        causes: [e0],
        message: fullMsg,
        context: fullObj,
      });
    });

    it('should ignore extras', () => {
      expect(resolveCeArgs([e0, fullMsg, fullObj, e1])).toEqual({
        causes: [e0],
        message: fullMsg,
        context: fullObj,
      });
    });

    it('should be ok with empty causes', () => {
      expect(resolveCeArgs([[], fullMsg, fullObj])).toEqual({
        causes: [],
        message: fullMsg,
        context: fullObj,
      });
    });

    it('should accept multiple causes', () => {
      expect(resolveCeArgs([[e0, e1, e2], fullMsg, fullObj])).toEqual({
        causes: [e0, e1, e2],
        message: fullMsg,
        context: fullObj,
      });
    });

    it('should be ok with nil causes', () => {
      expect(resolveCeArgs([undefined, fullMsg, fullObj])).toEqual({
        causes: [],
        message: fullMsg,
        context: fullObj,
      });
    });

    it('should be ok with empty messages', () => {
      expect(resolveCeArgs([e0, emptyMsg, fullObj])).toEqual({
        causes: [e0],
        message: emptyMsg,
        context: fullObj,
      });
    });

    it('should be ok with nil messages', () => {
      expect(resolveCeArgs([e0, undefined, fullObj])).toEqual({
        causes: [e0],
        message: '',
        context: fullObj,
      });
    });

    it('should be ok with empty contexts', () => {
      expect(resolveCeArgs([e0, fullMsg, emptyObj])).toEqual({
        causes: [e0],
        message: fullMsg,
        context: emptyObj,
      });
    });

    it('should be ok with nil contexts', () => {
      expect(resolveCeArgs([e0, fullMsg, undefined])).toEqual({
        causes: [e0],
        message: fullMsg,
        context: {},
      });
    });
  });

  describe('partials', () => {
    it('should be ok with missing cause', () => {
      expect(resolveCeArgs([fullMsg, fullObj])).toEqual({
        causes: [],
        message: fullMsg,
        context: fullObj,
      });
    });

    it('should be ok with missing message', () => {
      expect(resolveCeArgs([e0, fullObj])).toEqual({
        causes: [e0],
        message: '',
        context: fullObj,
      });
    });

    it('should be ok with missing cause and message', () => {
      expect(resolveCeArgs([fullObj])).toEqual({
        causes: [],
        message: '',
        context: fullObj,
      });
    });

    it('should be ok with missing context', () => {
      expect(resolveCeArgs([e0, fullMsg])).toEqual({
        causes: [e0],
        message: fullMsg,
        context: {},
      });
    });

    it('should be ok with missing cause and context', () => {
      expect(resolveCeArgs([fullMsg])).toEqual({
        causes: [],
        message: fullMsg,
        context: {},
      });
    });

    it('should be ok with missing message and context', () => {
      expect(resolveCeArgs([[e0, e2]])).toEqual({
        causes: [e0, e2],
        message: '',
        context: {},
      });
    });

    it('should be ok with all missing', () => {
      expect(resolveCeArgs([])).toEqual({
        causes: [],
        message: '',
        context: {},
      });
    });
  });
});
