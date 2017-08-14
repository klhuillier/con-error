function ceFormatsProvider(parsedSequence, stringFormat) {
  function formats(conError) {
    const firstSequence = parsedSequence(conError.sequences().first());

    function configurableFormat(config) {
      return {
        indent: number => formats(Object.assign({}, config, {indent: number})),
        jsonContexts: () => formats(Object.assign({}, config, {jsonContexts: true})),
        noColor: () => formats(Object.assign({}, config, {noColor: true})),
        string: () => stringFormat(firstSequence),
        object: () => {},
        json: () => {},
      };
    }

    return configurableFormat({});
  }

  return formats;
}

module.exports = ceFormatsProvider;
