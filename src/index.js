const ConError = require('./con-error')(
  require('./resolve-ce-args')(),
  require('./ce-chains')()
);

module.exports = ConError;
