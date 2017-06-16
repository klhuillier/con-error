# ConError

## Contextual Errors in JavaScript

###### Give context to your errors or the bunny gets it

## Why Another Error Library?

Wrapping errors with contextual info, including nested errors, every other library
seems to be lacking in. [VError by Joyent](https://github.com/joyent/node-verror) allows
nesting of errors, which is very helpful. But it does not have support for
nesting multiple errors *and* including context info in the same error object.

No other error library seems to do the above while blurring the line between an
Error object and a rejected Promise object.

And no other error library allows all of the above while additionally keeping
nested stack traces sane.

## Features

### Basic features

ConError allows including any plain object, as well as underlying errors. 

ConError behaves as a rejected Promise and can be returned as one.

ConError will make a deep copy of any contextual object provided to it. See the section
on Cloning.

### Stack traces

As an example, a call chain may be `refreshScreen <- refreshCart <- load <- get`.
If every method catches and rethrows with additional context, the resulting ConError would
print the stack trace:

```text
Error: failed to refresh screen
  at refreshScreen (screen.js:50:8)
Caused by: failed to refresh cart
  at refreshCart (cart.js:50:8)
Caused by: 'error getting cart details'
  context: {
    cartId: 1
  }
  at load (cart-details.js:50:8)
Caused by:
  context: {
    statusCode: 500,
    response: [a largeObject],
    cartId: 1,
    sessionId: 'e30d...'
  }
  at handleResponse (http:35:8)
  at sendReq (http:50:10)
  at get (http.js:80:8)
```

In the above example, rather than showing the complete stack trace for the innermost error,
ConError attempts to limit the stacktrace displayed to the lines unique to each error.

With multiple causes, this also attempts to keep the output as contextual as possible.
Multiple causes create separate traces for each chain:

```text
Error: failed to refresh screen
  at refreshScreen (screen.js:50:8)
Caused by: failed to refresh cart
  at refreshCart (cart.js:50:8)
Caused by: 'error getting cart details'
  context: {
    cartId: 1
  }
  at load (cart-details.js:50:8)
Caused by:
  context: {
    statusCode: 500,
    response: [a largeObject],
    cartId: 1,
    sessionId: 'e30d...'
  }
  at handleResponse (http:35:8)
  at sendReq (http:50:10)
  at get (http.js:80:8)
--
Additional Error: failed to refresh item information
  at refreshItems (items.js:80:8)
Caused by:
  context: {
    statusCode: 500,
    response: [a largeObject],
    cartId: 1,
    sessionId: 'e30d...'
  }
  at handleResponse (http:35:8)
  at sendReq (http:50:10)
  at get (http.js:80:8)
```

In the above example, the second printing did not reprint the errors for
refreshScreen() and refreshCart().

This is the default printing strategy. A verbose printer could print the complete stack trace
for every error, and a debugger could step through every error.

## Usage

### Basic Usage

```javascript
const ConError = require('con-error');
try {
  doSomething();
} catch (err) {
  throw new ConError(err, 'failed to do something', {
      userId: userId,
      service: service
    });
}
```

### Cloning

Because objects can be mutated by other parts of the application, when ConError is given
its context, it attempts to make a deep clone of the context object.

This is a way of avoiding cloning very large objects:

```javascript
new ConError({
  itemIds: cart.items.map(item => item.id)
})
```

## API

### new ConError(Error?, string?, {}?)
### new ConError(Error[]?, string?, {}?)

ConError accepts any arrangement of string, Error, array of Error, and arbitrary object,
with one exception: only one of Error or Error[] may be given.

A ConError may be created with no arguments. This isn't very helpful, of course.

The error or errors, if given, are causes of the ConError being thrown.

The string, if given is presented as the message line of the error in stack traces.
As a general best-practice, this should give a unique enough description of the context
for a developer to find where the ConError is raised from.

The arbitrary object at the end, if given, is the context object. This is intended for
including state of the time of the error to help diagnose the cause of the error.

Typical usage would be:

```javascript
try {
  doSomething();
} catch (e) {
  throw new ConError(e, 'failed in doSomething', locals);
}
```

Usage as a rejected Promise:

```javascript
promise
  .then(account => nextStep(account))
  .catch(e => new ConError(e, 'failed in nextStep to register user', {
    email: email
  }));
```

### .throw()

`.throw` does as it says, it will throw the ConError.

This isn't needed when used in a block, but in a lamdba function it can be helpful
for when the `throw` keyword is not permitted. e.g.,

```javascript
const assertPositive = number =>
  number > 0 ?
    number :
    new ConError('number not positive', {number: number}).throw();
``` 

## Promise-like functions

These functions mainly exist to make ConError appear Promise-like. The return values
are native es6 Promises (or polyfills) and can be chained as usual.

### ConError.all(Promise[], string?, {}?)

Similar to Promise.all, except if any Promise instances are rejected it resolves as
a rejected Promise with a ConError instance. A message string and context info
can be optionally provided.

```javascript
ConError.all(promises, 'failed in loading auction lot data', {lotId: lotId})
  .then(/* do something with all resolved */);
```

### .then(fn, fn?)

The first callback of `.then` is never called, since a ConError instance is always rejected.

When a rejected callback is given, this is called after the interpreter has settled. The
ConError instance is given as the argument to the callback.

This will call applyOption with the resolved value of defaultOption:

```javascript
fnThatReturnsConError()
  .then(opt => opt, () => defaultOption)
  .then(opt => applyOption(opt));
```

### .catch(fn)

The callback of `.catch` is always called after the interpreter has settled. The ConError
instance is given as the argument to the callback.
