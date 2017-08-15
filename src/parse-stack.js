function parseStackProvider(errorStackParser) {
  return function(error) {
    return errorStackParser.parse(error)
      .map(frame => ({
        function: frame.functionName,
        filename: frame.fileName,
        line: frame.lineNumber,
        column: frame.columnNumber,
        eval: frame.isEval,
        native: frame.isNative,
      }));
  };
}

module.exports = parseStackProvider;
