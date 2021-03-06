/*
 * Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
 *
 * Released under the zlib license. See LICENSE.md or
 * http://spdx.org/licenses/Zlib for the full license text.
 */

function resolveCeArgs(ceArgs) {
  const sortedArgs = [];

  // Removes values of expected types. If a nil (undefined and null) is encountered, it is
  // also removed. (To allow for either fn('0', [2]) or fn('0', undefined, [2]).)
  const shiftNil = () => {
    if (ceArgs[0] === undefined || ceArgs[0] === null) {
      ceArgs.shift();
    }
  };

  if (ceArgs[0] instanceof Error) {
    sortedArgs.push([ceArgs.shift()]);
  } else if (Array.isArray(ceArgs[0])) {
    sortedArgs.push(ceArgs.shift());
  } else {
    sortedArgs.push([]);
    shiftNil();
  }

  if (ceArgs[0] === ''+ceArgs[0]) {
    sortedArgs.push(ceArgs.shift());
  } else {
    sortedArgs.push('');
    shiftNil();
  }

  if (ceArgs[0] === Object(ceArgs[0])) {
    sortedArgs.push(ceArgs.shift());
  } else {
    sortedArgs.push({});
    shiftNil();
  }

  return {
    causes: sortedArgs[0],
    message: sortedArgs[1],
    context: sortedArgs[2],
  };
}

module.exports = resolveCeArgs;
