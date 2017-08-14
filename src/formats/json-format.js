function jsonFormats() {
  function jsonFormat(conError, config) {
    const indent = (typeof config === 'object' && typeof config.indent === 'number') ?
      config.indent :
      undefined;

    return {
      toString: () => JSON.stringify(conError, undefined, indent),
    };
  }

  return jsonFormat;
}

module.exports = jsonFormats;
