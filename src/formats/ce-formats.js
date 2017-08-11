function ceFormatsProvider(stringFormat) {
  function formats(conError) {
    function configurableFormat(config) {
      return {
        fullStacks: () => formats(Object.assign({}, config, {fullStacks: true})),
        indent: number => formats(Object.assign({}, config, {indent: number})),
        jsonContexts: () => formats(Object.assign({}, config, {jsonContexts: true})),
        noColor: () => formats(Object.assign({}, config, {noColor: true})),
        string: () => {},
        object: () => {},
        json: () => {},
      };
    }

    return configurableFormat({});
  }

  return formats;
}

module.exports = ceFormatsProvider;
