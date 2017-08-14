function parsedSequenceProvider(errorStackParser) {
  /**
   * Takes an array of error elements and produces an array of objects of
   * with keys: error, parsedStack, and cause.
   *
   * error is the original error
   *
   * parsedStack is the result of errorStackParser, an array of objects
   * identifying the components of each stack line.
   *
   * cause is a link to the next element in the sequence. The last element's
   * cause points to undefined.
   */
  function parsedSequence(rawSequence) {
    const result = rawSequence.map(element => ({
      error: element,
      parsedStack: errorStackParser.parse(element),
    }));
    result.forEach((element, index) => {
      element.cause = result[index + 1];
    });
    return result;
  }

  return parsedSequence;
}

module.exports = parsedSequenceProvider;
