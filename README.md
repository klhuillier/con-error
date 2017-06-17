# ConError - Contextual JavaScript Errors

###### Give context to your errors or the bunny gets it

## Features

### Basic features

ConError:
- attempts to avoid noise in stack traces by listing a full
  stack trace interleaved with exceptions thrown at each point in the stack
- behaves similar to a rejected Promise and can usually be returned as one
- allows including any plain object
- allows chaining errors together
- will make a deep copy of any contextual object provided to it to prevent
  unexpected mutation of objects before inspection

### Stack traces

As an example, a call chain may be `refreshScreen <- refreshCart <- load <- get`.
If every method catches and rethrows with additional context, the resulting ConError would
print the stack trace:

```text
Error: failed to refresh screen
  at refreshScreen (screen.js:50:8)
Caused by: Error: failed to refresh cart
  at refreshCart (cart.js:50:8)
Caused by: Error: error getting cart details
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

## API

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

### new ConError((Error|Error[])?, string?, {}?)

ConError accepts an Error or array of Errors, a message, and an arbitrary object. All
values are optional, but any that are given must appear in the expected order.

All three parameters have distinct purposes in diagnosing errors:
- nested errors hold the state for where the original error occurred, lower-level
- message is useful for giving a general description of what was being attempted in
  the frame this error was thrown from (it may even be distinct enough to locate the
  exact line in the application with grep)
- context gives a snapshot of the local variable state of the frame this error was
  thrown from

Typical usage would be:

```javascript
try {
  doSomething();
} catch (e) {
  throw new ConError(e, 'error in some process', locals);
}
```

Usage as a rejected Promise:

```javascript
return promise
  .then(account => nextStep(account))
  .catch(e => new ConError(e, 'failed in nextStep to register user', {
    email: email
  }));
```

### .throw()

`.throw` does as it says, it will throw the ConError.

Used when the `throw` keyword is not permitted, e.g., in a lamdba block:

```javascript
const assertPositive = number =>
  number > 0 ?
    number :
    new ConError('number not positive', {number: number}).throw();
``` 

### .toString()

Returns a string containing the entire stack trace of the ConError instance and the
*first parents* of its cause hierarchy. That is, it will only select the first cause for
each ConError with multiple causes.

To stringify all lines of errors, `cerr.aggregate().lines().map(e => e.toString())`

To stringify all individual errors, `cerr.aggregate().flattened().map(e => e.toString())`

### .write((WritableStream|Console)?)

Attempts to write the ConError's entire stack trace, and its cause hierarchy, to
the given writable stream. Like `.toString()`, this only selects the first parent 
in the cause hierarchy.

This attempts to use a `.write` method on the given argument, first. Second, it will try 
to use `.error`, so a console object can be passed to it.

If no object is not given, this will attempt to write to the global `console.error`.

To write all lines of errors, `cerr.aggregate().lines().forEach(e => e.write(stream))`

To write all individual errors, `cerr.aggregate().flattened().forEach(e => e.write(stream))`

### .aggregate()

Returns a `CeAggregate` instance with the callee as the referent object.

### .causes()

Returns a list of nested errors, if any. If there are none, this is an empty array.

### .message()

Returns the message the ConError was constructed with. If there was none, this is
an empty string.

### .context()

Returns the contextual object the ConError was constructed with. If there was none,
this is an empty object.

The object returned here is the same context object that is held by the ConError.
This is as opposed to the constructor parameter, which is cloned to capture the state
of the variables when the ConError is created.

### .stack()

Returns the full stack of this single error object, not including its causes. The
stack is produced by
[https://github.com/stacktracejs/error-stack-parser](error-stack-parse).

## CeAggregate

### .lines()

This returns an array of new ConError instances where:
- the referent ConError is the head of each chain
- each leaf in the hierarchy is returned
- each ConError in the new chain has exactly one child
- each chain ends with an object that is either not a ConError or was a ConError with no cause objects

The order of the array is not deterministic.

For example, if B failed because of two async functions, C and D, the returned array
could contain two ConError instances with hierarchies like this:

```text
before: [ A <- [ B <- E, C <- D ] ]

after: [
  A <- B <- E
  A <- C <- D
]
```

### .flatten()

Returns an array of the referent ConError as well as all Error types listed as causes in the
error hierarchy.

The order is not deterministic.

## ConError's Promise-like behavior

The `.then` function mainly exists to make ConError appear Promise-like. The return
values are native es6 Promises (or polyfills) and can be chained as usual.

**Caveat 0**

The EcmaScript standard checks for internal states which cannot be set by script.
With native es6, `Promise.resolve(conError) !== conError`.

The return value of `.then` is a native Promise, and `isNativePromise` is true in
this example:

```javascript
const p = conError.then(() => {}, () => {});
const isNativePromise = Promise.resolve(p) === p;
```

**Caveat 1**

ConError appears as an `instanceof Error`. It is not an `instanceof Promise`.

### ConError.all(Promise[], string?, {}?)

Similar to `Promise.all`, except when rejected, the ConError will contain *all* rejected
promises, not just the first.

A message string and context info can be optionally provided.

```javascript
ConError.all(promises, 'failed in loading auction lot data', {lotId: lotId})
  .then(/* do something with all resolved */);
```

### .then(fn, fn)

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

The callback is always called after the interpreter has settled.

The return value is a native Promise which will be resolved or rejected based on the callback.

## Miscellany

### Message formatted strings

sprintf messages are intentionally not supported. Most sprintf placeholders are to hold
things like IDs, and these should be listed in contextual objects.

A few reasons for this:

- The formal parameter list of the constructor is already long enough (Error, string, object)
   without making it variadic for sprintf arguments.
- You can still use a sprintf function while building a ConError object, e.g.,
   `new ConError(sprintf('user ID %d is invalid', userId))`
- sprintf arguments for errors are often to insert local values into the message string, which
   is what a context object is intended for:
   `new ConError('user ID is invalid', {userId: userId})`. This has the added benefits:
   - the message string remains constant and more easily grepped
   - large context objects are rendered very nicely in browser consoles
   - adding more context is easy without trying to put values into a string form
