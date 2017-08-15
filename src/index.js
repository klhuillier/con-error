const ConError = require('./con-error')(
  require('./resolve-ce-args'),
  require('./ce-sequences'),
  require('./formats/ce-formats')(
    require('./formats/string-format'),
    require('./formats/object-format'),
    require('./formats/json-format')(
      require('./formats/object-format')
    ),
  ),
  require('./cached-call'),
  require('./normalize-stack'),
  require('./parse-stack')(
    require('error-stack-parser')
  )
);

module.exports = ConError;
