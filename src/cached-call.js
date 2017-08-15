function cachedCall(callback) {
  let evaluated = false;
  let result;

  return function() {
    if (!evaluated) {
      result = callback();
      evaluated = true;
    }
    return result;
  };
}

module.exports = cachedCall;
