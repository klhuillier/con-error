function ceSequencesProvider(sequence) {
  function ceSequences(conError) {
    return {
      first: () => {
        if (!Array.isArray(conError.causes) || conError.causes.length <= 0) {
          return [conError];
        }
        const firstCause = conError.causes[0];
        if (typeof firstCause.sequences === 'function') {
          return [conError, ...firstCause.sequences().first()];
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
          if (typeof cause.sequences !== 'function') {
            result.push([conError, cause]);
          } else {
            cause.sequences().all()
              .forEach(seq => result.push([conError, ...seq]));
          }
        });
        return result;
      }
    };
  }

  return ceSequences;
}

module.exports = ceSequencesProvider;
