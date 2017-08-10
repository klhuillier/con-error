(function(angular, _) {
  'use strict';

  // I normally would use a lib for this, but I have never found one that is
  // decent. VError is probably the best, but it is node-only. I also prefer
  // the idea of optionally including contextual information with the error.
  // e.g., throw new CError('failed to get item information', err, {
  //  itemId: itemId,
  //  response: response
  // });

  function CError() {
    var msgArgs = _.toArray(arguments);

    this.stack = new Error().stack.split('\n').slice(2).join('\n');
    this.context = _.isPlainObject(_.last(msgArgs)) ? msgArgs.pop() : undefined;
    this.cause = _.isError(_.last(msgArgs)) ? msgArgs.pop() : undefined;
    this.message = _.map(msgArgs, function(arg) {
      return _.isPlainObject(arg) ? JSON.stringify(arg) : _.toString(arg);
    }).join(' ');
  }

  CError.prototype = Object.create(Error.prototype, {
    constructor: {
      value: CError,
      writable: true,
      configurable: true
    }
  });

  CError.prototype.serialize = function() {
    return {
      message: this.message,
      context: this.context,
      stack: this.stack,
      cause: _.hasIn(this.cause, 'serialize') ?
        this.cause.serialize() :
        (_.hasIn(this.cause, 'stack') ? this.cause.stack : '')
    };
  };

  CError.prototype.print = function(writeFn) {
    (writeFn || console.error.bind(console))(this.serialize());
  };

  CError.prototype.toString = function() {
    function causeToString(cause) {
      if (_.isNil(cause)) {
        return '';
      } else if (!_.isError(cause)) {
        return _.toString(cause);
      }
      if (_.hasIn(cause, 'cause')) {
        // Nested CError or CError-like object
        return cause.toString();
      } else {
        return cause.stack;
      }
    }
    return this.message +
      (this.context ? '\n    Context: ' + JSON.stringify(this.context) : '') +
      ('\n' + this.stack) +
      (this.cause ? '\n' + causeToString(this.cause) : '');
  };

  angular.module('auccon.experimental')
    .constant('CError', CError);
})(window.angular, window._);
