const ConError = require('./con-error')(
  require('./resolve-ce-args')(),
  require('./ce-sequences')()
);

module.exports = ConError;
