function droppedTopStackFrameFactory(errorStackParser) {
  return {
    parse: err => errorStackParser.parse(err).slice(1)
  };
}

module.exports = droppedTopStackFrameFactory;
