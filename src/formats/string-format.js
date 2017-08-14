function stringFormatProvider() {
  const stringifyContext = (error) => (error.context && Object.keys(error.context).length > 0
    ? '  context: '
      + JSON.stringify(error.context, undefined, 2).replace(/\n/g, '\n  ')
      + '\n'
    : '');

  const stringifyFunction = (line) => (line.isNative && ' [native]')
    || (line.isEval && ' [eval]')
    || (line.functionName ? ' ' + line.functionName : '');

  const stringifyFileLocation = (line) => (line.fileName || 'unknown')
    + ((typeof line.lineNumber === 'number')
      ? ':' + line.lineNumber
        + (
          (typeof line.columnNumber === 'number') ? ':' + line.columnNumber : ''
        )
      : '');

  const stringifyStackLine = (line) => {
    const fid = stringifyFunction(line);
    const loc = stringifyFileLocation(line);
    return `  at${fid} (${loc})\n`;
  };

  function errToString(cause) {
    return cause.error.message + '\n'
      + stringifyContext(cause.error)
      + cause.parsedStack.map(stringifyStackLine).join('');
  }

  function stringFormat(parsedSequence) {
    return 'Error: ' + errToString(parsedSequence[0])
      + parsedSequence.slice(1)
        .map(cause => 'Caused by: ' + errToString(cause))
        .join('');
  }

  return stringFormat;
}

module.exports = stringFormatProvider;
