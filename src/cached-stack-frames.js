function cachedStackFramesFactory(errorStackParser) {
  function CachedStackFrames(err) {
    let cached;

    this.toObject = () => cached = cached ||
      errorStackParser.parse(err)
        .map(frame => ({
          'function': frame.functionName,
          'script': frame.fileName,
          'line': frame.lineNumber,
          'column': frame.columnNumber,
          'eval': frame.isEval,
          'native': frame.isNative,
          'constructor': frame.isConstructor,
        }));
  }

  return CachedStackFrames;
}

module.exports = cachedStackFramesFactory;
