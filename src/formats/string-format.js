function stringFormatProvider(stringify) {
  const stringifyContext = (error) => (error.context && Object.keys(error.context).length > 0
    ? '  context: '
      + stringify(error.context, undefined, 2).replace(/\n/g, '\n  ')
      + '\n'
    : '');

  function errToString(cause) {
    return cause.name + ': ' + cause.message + '\n'
      + stringifyContext(cause)
      + cause.stack
      + '\n';
  }

  function stringFormat(parsedSequence) {
    return errToString(parsedSequence[0])
      + parsedSequence.slice(1)
        .map(cause => 'Caused by: ' + errToString(cause))
        .join('');
  }

  return stringFormat;
}

module.exports = stringFormatProvider;
