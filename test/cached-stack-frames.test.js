const errorStackParser = require('error-stack-parser');
const cachedStackFramesFactory = require('../src/cached-stack-frames');
const stacks = require('./stacks');
const CachedStackFrames = cachedStackFramesFactory(errorStackParser);

describe('cachedStackFrames', () => {
  it('should map stack traces as expected', () => {
    const frames = new CachedStackFrames(stacks.errors.chrome46).toObject();
    expect(frames[1].function).toEqual('HTMLButtonElement.onclick');
  });
});
