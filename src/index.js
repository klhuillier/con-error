const ConError = require('./con-error')(
  require('./resolve-ce-args')()
);

module.exports = ConError;
