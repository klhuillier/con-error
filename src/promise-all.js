function promiseAll(promises) {
  return new Promise((resolveAll, rejectAll) => {
    let unresolved = 0;
    let resolutions = [];
    let rejections = [];

    const complete = () => {
      if (unresolved > 0) {
      } else if (rejections.length > 0) {
        rejectAll(rejections);
      } else {
        resolveAll(resolutions);
      }
    };

    promises.forEach((p, idx) => {
      if (typeof p !== 'object' || typeof p.then !== 'function') {
        resolutions[idx] = p;
        return;
      }

      ++unresolved;

      p.then(value => {
          --unresolved;
          resolutions[idx] = value;
          complete();
        })
        .catch(error => {
          --unresolved;
          rejections[idx] = error;
          complete();
        });
    });

    // Runs synchronously after forEach. If there are no promises in the
    // given array, immediately resolve.
    if (unresolved === 0) {
      complete();
    }
  });
}

module.exports = promiseAll;
