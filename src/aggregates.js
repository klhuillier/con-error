function Aggregates(conError) {
  this.conError = conError;
}

const buildChains = ce => {
  const causes = ce.causes();
  const newChildren = [];
  causes.forEach(cause => {
    if (typeof cause.causes === 'function') {
      buildChains(cause).forEach(child => newChildren.push(child));
    } else {
      newChildren.push(cause);
    }
  });
  return newChildren;
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

Aggregates.prototype.chains = () => buildChains(this.conError);
Aggregates.prototype.flatten = () => flatten(this.conError);

module.exports = Aggregates;
