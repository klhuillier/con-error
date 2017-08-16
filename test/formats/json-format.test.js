const jsonFormatProvider = require('../../src/formats/json-format');

const passthruFormat = (obj, config) => jsonFormatProvider(
  obj => obj,
  (obj, replacer, indent) => [obj, indent]
)(obj, config);

const emptyObj = {};

describe('jsonFormat', () => {
  it('should accept no config', () => {
    expect(passthruFormat(emptyObj)).toEqual([emptyObj, undefined]);
  });

  it('should accept config without indent', () => {
    expect(passthruFormat(emptyObj, {id: 3})).toEqual([emptyObj, undefined]);
  });

  it('should accept config with indent', () => {
    expect(passthruFormat(emptyObj, {indent: 3})).toEqual([emptyObj, 3]);
  });
});
