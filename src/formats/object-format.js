/*
 * Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
 *
 * Released under the zlib license. See LICENSE.md or
 * http://spdx.org/licenses/Zlib for the full license text.
 */

const formatCe = (conError) => ({
  name: conError.name,
  message: conError.message,
  stack: conError.stack,
  context: conError.context,
  causes: conError.causes.map(objectFormat),
});

const formatErr = (error) => ({
  name: error.name,
  message: error.message,
  stack: error.stack,
});

function objectFormat(error) {
  if (error.formats && error.formats.call && Array.isArray(error.causes)) {
    return formatCe(error);
  }
  return formatErr(error);
}

module.exports = objectFormat;
