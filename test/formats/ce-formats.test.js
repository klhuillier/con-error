const identity1 = (arg0) => [arg0];
const identity2 = (arg0, arg1) => [arg0, arg1];

const ceFormatProvider = require('../../src/formats/ce-formats');

const seq = [{message: 'first err'}];

const cErr = {
  sequences: () => ({
    first: () => seq
  })
};

describe('ceFormats', () => {
  it('should stringify', () => {
    expect(ceFormatProvider(identity1)(cErr).string()).toEqual([seq]);
  });

  it('should objectify', () => {
    expect(ceFormatProvider(undefined, identity1)(cErr).object()).toEqual([cErr]);
  });

  it('should jsonify', () => {
    expect(ceFormatProvider(undefined, undefined, identity2)(cErr).json())
      .toEqual([cErr, undefined]);
  });

  it('should jsonify with args', () => {
    expect(ceFormatProvider(undefined, undefined, identity2)(cErr).json({indent: 2}))
      .toEqual([cErr, {indent: 2}]);
  });
});
