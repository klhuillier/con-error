/*
 * Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
 *
 * Released under the zlib license. See LICENSE.md or
 * http://spdx.org/licenses/Zlib for the full license text.
 */

function jsonFormatProvider(objectFormat, stringify) {
  return function(conError, config) {
    const indent = (config && config.indent === ~~config.indent)
      ? config.indent
      : undefined;

    return stringify(objectFormat(conError), undefined, indent);
  };
}

module.exports = jsonFormatProvider;
