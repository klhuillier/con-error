function jsonFormatProvider(objectFormat, stringify) {
  return function(conError, config) {
    const indent = (config && config.indent === ~~config.indent) ?
      config.indent :
      undefined;

    return stringify(objectFormat(conError), undefined, indent);
  };
}

module.exports = jsonFormatProvider;
