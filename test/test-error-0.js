const ConError = require('../src/index');

function root0() {
  return new Error('root0');
}
const root1 = () => new ConError('root1');
const root2 = () => new ConError('root2');
const root3 = () => new ConError('root3');

const levelA0 = () => new ConError([root0(), root1()], 'levelA0');
const levelA2 = () => new ConError(root2(), 'levelA2');
const levelA3 = () => new ConError(root3(), 'levelA3');

const levelB0 = () => levelA0();
const levelB2 = () => levelA2();
const levelB3 = () => new ConError(levelA3(), 'levelB3');

const levelC0 = () => new ConError(levelB0(), 'levelC0');
const levelC2 = () => levelB2();
const levelC3 = () => levelB3();

// 2 seqs from root0 and root1
const leaf0 = () => levelC0();
// 2 seqs from root2 and root3
const leaf2 = () => new ConError([levelC2(), levelC3()], 'leaf2');

const cError = new ConError([leaf0(), leaf2()], 'cError');

module.exports = cError;
