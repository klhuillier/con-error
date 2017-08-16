function ceFormatsProvider(stringFormat, objectFormat, jsonFormat) {
  function formats(conError) {
    return {
      string: () => stringFormat(conError.sequences().first()),
      object: () => objectFormat(conError),
      json: (options) => jsonFormat(conError, options),
    };
  }

  return formats;
}

module.exports = ceFormatsProvider;
