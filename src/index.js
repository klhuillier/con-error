const ConError = require('./con-error')(
  require('./resolve-ce-args')(),
  require('./ce-sequences')(),
  require('./formats/ce-formats')(
    require('./parsed-sequence')(
      require('error-stack-parser')
    ),
    require('./formats/string-format')()
  )
);

module.exports = ConError;
