module.exports = require('./ce-factory')(
  require('./con-error')(
    require('./formats'),
    require('./aggregates')
  ),
  require('./cached-stack-frames')(
    require('./remapped-stack-frames')(
      require('./dropped-top-stack-frame')(
        require('error-stack-parser')
      )
    )
  )
);
