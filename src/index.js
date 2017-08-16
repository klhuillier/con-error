module.exports = require('./con-error')(
  require('./resolve-ce-args'),
  require('./ce-sequences'),
  require('./formats/ce-formats')(
    require('./formats/string-format'),
    require('./formats/object-format'),
    require('./formats/json-format')(
      require('./formats/object-format')
    ),
  )
);
