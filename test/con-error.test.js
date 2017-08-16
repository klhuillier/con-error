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

    it('should clone the context', () => {
      const expected = {id: 4152};
      const orig = {id: expected.id};
      const conError = new ConError(orig);
      ++orig.id;
      expect(conError.context).toEqual(expected);
    });
  });

  describe('basic props', () => {
    it('should get a stack', () => {
      expect(typeof (new ConError(cause0).stack)).toEqual('string');
    });

    it('its throw should throw itself', () => {
      const conError = new ConError(messageBoom);
      try {
        conError.throw();
        fail('ce not thrown');
      } catch (e) {
        expect(e).toBe(conError);
      }
    });

    it('should return a sequences obj', () => {
      expect(new ConError().sequences()).toHaveProperty('first');
    });

    it('should return a formats obj', () => {
      expect(new ConError().formats()).toHaveProperty('json');
    });

    it('should stringify itself', () => {
      expect(new ConError().toString()).toMatch(/Error/);
    });
  });

  describe('Promise-like behavior', () => {
    describe('nativity', () => {
      it('should not be a native Promise', () => {
        expect(new ConError()).not.toBeInstanceOf(Promise);
      });

      it('should return a native Promise from then', () => {
        expect(new ConError().then(() => {}, () => {})).toBeInstanceOf(Promise);
      });

      it('should return a native Promise from catch', () => {
        expect(new ConError().catch(() => {})).toBeInstanceOf(Promise);
      });
    });

    describe('callbacks run after interpreter settles', () => {
      it('should call then callback', done => {
        // This will timeout if it doesn't work. I'm not sure of a better way around this
        new ConError().then(fail, () => done());
      });

      it('should call then callback', done => {
        // This will timeout if it doesn't work. I'm not sure of a better way around this
        new ConError().catch(() => done());
      });

      it('should call then callback asynchronously', done => {
        const arr = [99];
        new ConError()
          .then(fail, () => {
            expect(arr[0]).toEqual(98);
            done();
          })
          .catch(err => done(fail(err)));
        --arr[0];
      });

      it('should call catch callback asynchronously', done => {
        const arr = [99];
        new ConError()
          .catch(() => {
            expect(arr[0]).toEqual(98);
            done();
          })
          .catch(err => done(fail(err)));
        --arr[0];
      });
    });

    describe('callback arguments, results', () => {
      it('should pass itself as the then reject argument', done => {
        new ConError(messageBoom)
          .then(() => done(fail()), err => {
            expect(err.message).toEqual(messageBoom);
            done();
          })
          .catch(err => done(fail(err)));
      });

      it('then callback result should pass on to next promise', done => {
        new ConError()
          .then(() => done(fail()), () => ctxCode)
          .then(obj => {
            expect(obj).toEqual(ctxCode);
            done();
          })
          .catch(err => done(fail(err)));
      });

      it('should pass itself as the catch reject argument', done => {
        new ConError(messageBoom)
          .catch(err => {
            expect(err.message).toEqual(messageBoom);
            done();
          })
          .catch(err => done(fail(err)));
      });

      it('catch callback result should pass on to next promise', done => {
        new ConError()
          .catch(() => ctxCode)
          .then(obj => {
            expect(obj).toEqual(ctxCode);
            done();
          })
          .catch(err => done(fail(err)));
      });

      it('should work as a rejected promise', done => {
        Promise.reject(messageBoom)
          .catch(msg => new ConError(msg))
          .then(() => done(fail('ConError not treated as a rejected promise')))
          .catch(err => {
            expect(err).toBeInstanceOf(ConError);
            done();
          })
          .catch(err => done(fail(err)));
      });
    });
  });
});
