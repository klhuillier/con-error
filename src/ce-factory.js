function ConErrorFactory(ConError) {
  /**
   * @param causes [Error?|Error[]?] caught errors that are wrapped in this new one
   * @param message [string?] a plain string describing the error
   * @param context [{}?] an object capturing state from the frame the error is thrown from
   * @return [ConError]
   */
  function newConError(causes, message, context) {
    const sortedArgs = [];
    const capturedError = new Error();

    // Sort args.
    // Removes values of expected types. If a nil (undefined and null) is encountered, it is
    // also removed. (To allow for either fn('0', [2]) or fn('0', undefined, [2]).)
    (function() {
      const shiftNil = () => {
        if (tmp[0] === undefined || tmp[0] === null) {
          tmp.shift();
        }
      };

      const tmp = Array.from(arguments);

      if (tmp[0] instanceof Error) {
        sortedArgs.push([tmp.shift()]);
      } else if (Array.isArray(tmp[0])) {
        sortedArgs.push(tmp.shift());
      } else {
        sortedArgs.push([]);
        shiftNil();
      }

      if (typeof tmp[0] === 'string') {
        sortedArgs.push(tmp.shift());
      } else {
        sortedArgs.push('');
        shiftNil();
      }

      if (typeof tmp[0] === 'object') {
        sortedArgs.push(tmp.shift());
      } else {
        sortedArgs.push({});
        shiftNil();
      }
    }());

    sortedArgs.push(capturedError);

    return new ConError(...sortedArgs);
  }

  return newConError;
}

module.exports = ConErrorFactory;
