function jsonFormatProvider(objectFormat, stringify) {
  return function(conError, config) {
    const indent = (typeof config === 'object' && typeof config.indent === 'number') ?
      config.indent :
      undefined;

    return stringify(objectFormat(conError), undefined, indent);
  };
}

module.exports = jsonFormatProvider;
