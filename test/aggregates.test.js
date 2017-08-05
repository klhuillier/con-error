const aggregatesFactory = require('../src/aggregates');
const conErrorFactory = require('../src/ce-factory');
const ConError = require('../src/con-error')({}, {});

const newConError = (err, message, context) => ({
  err: err,
  message: message,
  context: context,
});

const Aggregates = aggregatesFactory(newConError);

describe.skip('Aggregates', () => {
  it.skip('asdf', () => {});
});
