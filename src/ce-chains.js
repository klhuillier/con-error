function ceChainsProvider() {
  function ceChains(conError) {
    return {
      firstSequence: () => {
        if (!Array.isArray(conError.causes) || conError.causes.length <= 0) {
          return [conError];
        }
        const firstCause = conError.causes[0];
        if (typeof firstCause.chains === 'function') {
          return [conError, ...firstCause.chains().firstSequence()];
        } else {
          return [conError, firstCause];
        }
      },
      allSequences: () => {
        if (!Array.isArray(conError.causes) || conError.causes.length === 0) {
          return [[conError]];
        }
        const result = [];
        conError.causes.forEach(cause => {
          if (typeof cause.chains !== 'function') {
            result.push([conError, cause]);
          } else {
            cause.chains().allSequences()
              .forEach(seq => result.push([conError, ...seq]));
          }
        });
        return result;
      }
    };
  }

  return ceChains;
}

module.exports = ceChainsProvider;
