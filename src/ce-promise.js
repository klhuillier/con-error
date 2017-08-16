function cePromise(conError) {
  this.then = (resolved, rejected) =>
      typeof rejected === 'function'
        ? this.catch(rejected)
        : Promise.reject(conError);
  this.catch = (rejected) => Promise.resolve(() => rejected(conError));
}

module.exports = cePromise;
