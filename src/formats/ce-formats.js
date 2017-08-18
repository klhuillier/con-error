/*
 * Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
 *
 * Released under the zlib license. See LICENSE.md or
 * http://spdx.org/licenses/Zlib for the full license text.
 */

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
