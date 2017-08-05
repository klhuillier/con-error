const StackFrames = require('./cached-stack-frames')(
  require('./remapped-stack-frames')(
    require('./dropped-top-stack-frame')(
      require('error-stack-parser')
    )
  )
);
const Aggregates = require('./aggregates');
const Formats = require('./formats');
const ConError = require('./con-error')(Formats, Aggregates);
const CeFactory = require('./ce-factory')(ConError, StackFrames);

module.exports = CeFactory;
