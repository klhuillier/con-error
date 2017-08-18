/*
 * Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
 *
 * Released under the zlib license. See LICENSE.md or
 * http://spdx.org/licenses/Zlib for the full license text.
 */

module.exports = require('./con-error')(
  require('./resolve-ce-args'),
  require('./ce-sequences'),
  require('./formats/ce-formats')(
    require('./formats/string-format')(
      JSON.stringify
    ),
    require('./formats/object-format'),
    require('./formats/json-format')(
      require('./formats/object-format'),
      JSON.stringify
    ),
  )
);
