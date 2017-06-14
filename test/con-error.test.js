const ConError = require('../src/con-error');

const toError = cerr => {
  try {
    cerr.throw();
  } catch (err) {
    return err;
  }
  throw new Error('ConError was not thrown');
};

describe('ConError', () => {
  describe('Contexts', () => {
    it('thrown simple context only', () => {
      const expectedItemId = 1;
      expect(toError(ConError.context({itemId: expectedItemId})).context().itemId).toEqual(expectedItemId);
    });
  });

  describe('Multiple causes', () => {
    it('thrown with several causes', () => {
      const expected = [new Error('!'), new Error(':(')];
      expect(toError(ConError.causedBy(expected)).causes()).toEqual(expected);
    });

    it('thrown with causes added in multiple calls', () => {
    });

    it('thrown with single cause', () => {
    });

    it('thrown with no causes', () => {
    });
  });

  describe('Full args', () => {
    it('single call for each arg', () => {
      ConError
        .message('this is a test')
        .context({status: 401, statusText: 'Not Authorized'})
        .causedBy(new Error('HTTP/1.1 401 Not Authorized'));
    });
  });
});
