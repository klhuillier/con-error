const objectFormat = require('../../src/formats/object-format');
const testError0 = require('../test-error-0');

describe('objectFormat', () => {
  // Test case 0:
  // cError <- [
  //   levelC0 <- levelA0 <- [
  //     root0(Error),
  //     root1(ConError),
  //   ],
  //   leaf2 <- [
  //     levelA2 <- root2(CE),
  //     levelB3 <- levelA3 <- root3(CE)
  //   ],
  // ]

  it('should objectify the entire test case 0', () => {
    const obj = objectFormat(testError0);

    expect(obj.message).toEqual('cError');
    expect(obj.causes.length).toEqual(2);

    expect(obj.causes[0].message).toEqual('levelC0');
    expect(obj.causes[0].causes[0].causes[0].message).toEqual('root0');
    expect(obj.causes[0].causes[0].causes[0].causes).toBeUndefined();

    expect(obj.causes[1].message).toEqual('leaf2');
    expect(obj.causes[1].causes[0].causes[0].causes).toEqual([]);
    expect(obj.causes[1].causes[1].causes[0].causes[0].causes).toEqual([]);
  });
});
