const stringFormat = require('../../src/formats/string-format')(
  JSON.stringify
);
const testSeq0 = require('../test-error-0').sequences().first();


// Not going to do tests for the appearance of the output, that is something
// better checked by eye. However, there are a few things I would like to
// assert are being done correctly.

describe('stringFormat', () => {
  it('prints a single cause', () => {
    expect(stringFormat([testSeq0[0]])).not.toMatch(/Caused by:/m);
  });

  it('prints multiple causes', () => {
    expect(stringFormat(testSeq0)).toMatch(/Caused by:/m);
  });

  it('prints no context', () => {
    expect(stringFormat(testSeq0)).not.toMatch(/ context:/m);
  });

  it('prints context', () => {
    testSeq0[1].context={id:1};
    expect(stringFormat(testSeq0)).toMatch(/ context:/m);
  });
});
