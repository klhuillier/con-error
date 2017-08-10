function Aggregates(conError) {
  this.conError = conError;
}

// Input: causes: [A <- [X, Y <- 0], [B <- 1]]
// 0 returns: [[0]]
// Y returns: [[Y, 0]]
// X returns: [[X]]
// A returns: [[A, X], [A, Y, 0]]
// 1 returns: [[1]]
// B returns: [[B, 1]]
// root returns: [[A, X], [A, Y, 0], [B, 1]]

const buildChains = ce => {
  // If this isn't a ConError or it is a leaf ConError, return a set
  // containing just this error
  if (typeof ce !== 'object' || !Array.isArray(ce.causes) || ce.causes.length === 0) {
    return [[ce]];
  }

  const result = [];

  ce.causes.map(cause => buildChains(cause))
    .forEach(cause => {
      cause.forEach(chain => {
        result.push([ce, ...chain]);
      });
    });

  return result;
};

const flatten = ce => {
  const allErrors = [ce];
  const stack = Array.from(ce.causes);
  while (stack.length > 0) {
    const cause = stack.shift();
    allErrors.push(cause);
    if (Array.isArray(cause.causes)) {
      cause.causes.forEach(child => stack.push(child));
    }
  }
  return allErrors;
};

Aggregates.prototype.chains = function() {
  return buildChains(this.conError);
};
Aggregates.prototype.flatten = function() {
  return flatten(this.conError);
};

module.exports = Aggregates;
