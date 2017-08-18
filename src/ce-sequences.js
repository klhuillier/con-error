/*
 * Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
 *
 * Released under the zlib license. See LICENSE.md or
 * http://spdx.org/licenses/Zlib for the full license text.
 */

function ceSequence(conError) {
  return {
    first: () => {
      if (!Array.isArray(conError.causes) || conError.causes.length <= 0) {
        return [conError];
      }
      const firstCause = conError.causes[0];
      if (firstCause.sequences && firstCause.sequences.call) {
        return [conError].concat(firstCause.sequences().first());
      } else {
        return [conError, firstCause];
      }
    },
    all: () => {
      if (!Array.isArray(conError.causes) || conError.causes.length === 0) {
        return [[conError]];
      }
      const result = [];
      conError.causes.forEach(cause => {
        if (cause.sequences && cause.sequences.call) {
          cause.sequences().all()
            .forEach(seq => result.push([conError].concat(seq)));
        } else {
          result.push([conError, cause]);
        }
      });
      return result;
    }
  };
}

module.exports = ceSequence;
