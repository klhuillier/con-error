function conErrorProvider(resolveCeArgs, ceChains) {
  // To preserve identity of the constructor and allow as much flexibility as possible for arguments
  // accepted, there are two ways to call the ConError ctor: the user-visible form and the normalized
  // internal form. I really hate the way this looks, but it seems like the best way to preserve the
  // identity (err instanceof ConError) while ensuring the args are as expected. (I *could* use a
  // separate fn and require users do `createConError`, `ConError.create`, etc, but I also hate that.)

  const argsAreNormalized = (resolvedArgs, capturedError) =>
    typeof resolvedArgs === 'object' &&
    Array.isArray(resolvedArgs.causes) &&
    typeof resolvedArgs.message === 'string' &&
    typeof resolvedArgs.context === 'object' &&
    capturedError instanceof Error;

  function ConError(resolvedArgs, capturedError) {
    if (!argsAreNormalized(resolvedArgs, capturedError)) {
      return new ConError(resolveCeArgs(Array.from(arguments)), new Error());
    }

    this.causes = resolvedArgs.causes;
    this.message = resolvedArgs.message;
    this.context = resolvedArgs.context;
    this.stack = capturedError.stack;
    this.throw = () => {throw this;};
    this.chains = () => ceChains(this);
  }

  ConError.prototype = Object.create(Error.prototype, {});
  // Explicitly set the name for minification
  ConError.prototype.name = 'ConError';

  return ConError;
}

module.exports = conErrorProvider;
