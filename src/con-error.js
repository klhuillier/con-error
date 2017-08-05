function conErrors(Formats, Aggregates) {
  /**
   * @param causes [Error[]] caught errors that are wrapped in this new one
   * @param message [string] a plain string describing the error
   * @param context [{}] an object capturing state from the frame the error is thrown from
   * @param capturedFrames [CachedStackFrames] error containing the stack when this ConError was created
   * @constructor
   */
  function ConError(causes, message, context, capturedFrames) {
    this.causes = () => causes;

    this.message = () => message;

    this.context = () => context;

    this.stack = () => capturedFrames.toObject();

    this.throw = () => {throw this;};

    this.toString = () => ''+this.stack();

    this.formats = () => {};

    this.aggregate = () => {};
  }

  ConError.prototype = Object.create(Error.prototype, {});
  // Explicitly set the name for minification
  ConError.prototype.name = 'ConError';

  return ConError;
}

module.exports = conErrors;
