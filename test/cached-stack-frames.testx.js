const stacks = require('./stacks');
const CachedStackFrames = require('../src/cached-stack-frames')(
  require('../src/remapped-stack-frames')(
    require('error-stack-parser')
  )
);

describe('cachedStackFrames', () => {
  it('should map stack traces as expected', () => {
    const frames = new CachedStackFrames(stacks.errors.chrome46).toObject();
    expect(frames[1].function).toEqual('HTMLButtonElement.onclick');
  });
});
