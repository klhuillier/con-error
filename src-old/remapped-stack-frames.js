function remappedStackFramesFactory(errorStackParser) {
  return {
    parse: err => errorStackParser.parse(err)
      .map(frame => ({
        'function': frame.functionName,
        'script': frame.fileName,
        'line': frame.lineNumber,
        'column': frame.columnNumber,
        'eval': frame.isEval,
        'native': frame.isNative,
        'constructor': frame.isConstructor,
      }))
  };
}

module.exports = remappedStackFramesFactory;
