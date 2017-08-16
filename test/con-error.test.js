// TODO Rewrite this without ./src/index
const ConError = require('../src/index');

const messageBoom = 'boom!';
const cause0 = new Error();
const cause1 = new Error();
const cause2 = new Error();
const ctxCode = {code: 127};

describe('ConError', () => {
  describe('identity', () => {
    it('should be a ConError', () => {
      expect(new ConError(messageBoom, ctxCode)).toBeInstanceOf(ConError);
    });

    it('should be a type of Error', () => {
      expect(new ConError(messageBoom, ctxCode)).toBeInstanceOf(Error);
    });
  });

  describe('args', () => {
    it('should get zero cause', () => {
      expect((new ConError(messageBoom, ctxCode)).causes).toEqual([]);
    });

    it('should get one cause', () => {
      expect((new ConError(cause0)).causes).toEqual([cause0]);
    });

    it('should get three causes', () => {
      expect((new ConError([cause0, cause1, cause2], ctxCode)).causes)
        .toEqual([cause0, cause1, cause2]);
    });

    it('should get a message', () => {
      expect((new ConError([cause0], messageBoom)).message).toEqual(messageBoom);
    });

    it('should get a context', () => {
      expect((new ConError('', ctxCode)).context).toEqual(ctxCode);
    });
  });
});
