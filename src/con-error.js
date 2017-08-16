function conErrorProvider(resolveCeArgs, ceSequences, ceFormats) {
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

  // Deep cloning context to capture contextual state at creation of ConError.
  // Not doing this can allow the contextual state to change later which does not
  // help debugging. This does not preserve functions, and Dates do not convert
  // back to Date objects. Given the purpose is for debugging, I don't think either
  // will be particularly helpful to put into context anyway.

  const deepClone = obj => JSON.parse(JSON.stringify(obj));

  function ConError(resolvedArgs, capturedError) {
    if (!argsAreNormalized(resolvedArgs, capturedError)) {
      return new ConError(resolveCeArgs(Array.from(arguments)), new Error());
    }

    this.causes = resolvedArgs.causes;
    this.message = resolvedArgs.message;
    this.context = deepClone(resolvedArgs.context);
    this.stack = capturedError.stack;
    // slice(1) to drop the frame created in the `new Error()` above
    this.throw = () => {throw this;};
    this.sequences = () => ceSequences(this);
    this.formats = () => ceFormats(this);
  }

  ConError.prototype = Object.create(Error.prototype, {});
  ConError.prototype.constructor = ConError;
  // Explicitly set the name for minification. It's a reserved identifier in our build, but
  // the script may be minified by another build script.
  ConError.prototype.name = 'ConError';

  return ConError;
}

module.exports = conErrorProvider;
