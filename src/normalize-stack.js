const stringifyFunction = (frame) => (frame.eval && '<eval>')
  || (frame.function && frame.function !== '' && frame.function)
  || '<anonymous>';

const stringifyFilename = (frame) => (frame.native && '<native>')
  || (frame.filename)
  || '<anonymous>';

const stringifyFileLocation = (frame) => stringifyFilename(frame)
  + ((typeof frame.line === 'number')
    ? ':' + frame.line
      + (
        (typeof frame.column === 'number') ? ':' + frame.column : ''
      )
    : '');

const stringifyStackLine = (line) => {
  const fid = stringifyFunction(line);
  const loc = stringifyFileLocation(line);
  return '  at ' + fid + ' (' + loc + ')';
};

function normalizeStack(parsedStack) {
  return parsedStack.map(stringifyStackLine);
}

module.exports = normalizeStack;
