function cachedStackFramesFactory(errorStackParser) {
  function CachedStackFrames(err) {
    let cached;

    this.toObject = () => cached = cached || errorStackParser.parse(err);
  }

  return CachedStackFrames;
}

module.exports = cachedStackFramesFactory;
