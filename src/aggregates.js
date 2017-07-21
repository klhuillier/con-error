function aggregatesFactory(ConError, formats, aggregates) {
  function Aggregates(conError) {
    this.conError = conError;
  }

  const buildChain = ce => {
    const causes = ce.causes();
    const newChildren = [];
    causes.forEach(cause => {
      if (typeof cause.causes === 'function') {
        buildChain(cause).forEach(child => newChildren.push(child));
      } else {
        newChildren.push(cause);
      }
    });
    return newChildren.map(err => new ConError(err, formats, aggregates));
  };

  const flatten = ce => {
    const allErrors = [ce];
    const stack = ce.causes();
    while (stack.length > 0) {
      const cause = stack.shift();
      allErrors.push(cause);
      if (typeof cause.causes === 'function') {
        cause.causes().forEach(child => stack.push(child));
      }
    }
    return allErrors;
  };

  Aggregates.prototype.chains = () => buildChain(this.conError);
  Aggregates.prototype.flatten = () => flatten(this.conError);
}

module.exports = aggregatesFactory;
