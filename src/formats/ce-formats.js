function ceFormatsProvider(stringFormat, objectFormat, jsonFormat) {
  function formats(conError) {
    function configurableFormat(config) {
      return {
        indent: number => formats(Object.assign({}, config, {indent: number})),
        jsonContexts: () => formats(Object.assign({}, config, {jsonContexts: true})),
        noColor: () => formats(Object.assign({}, config, {noColor: true})),
        string: () => stringFormat(conError.sequences().first()),
        object: () => objectFormat(conError),
        json: (options) => jsonFormat(conError, options),
      };
    }

    return configurableFormat({});
  }

  return formats;
}

module.exports = ceFormatsProvider;
