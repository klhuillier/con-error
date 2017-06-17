# ConError

## Contextual Errors in JavaScript

###### Give context to your errors or the bunny gets it

## Why Another Error Library?

Every other library seems to lack the ability to wrap errors with contextual info,
including nested errors. [VError by Joyent](https://github.com/joyent/node-verror)
is the closest. But it does not have support for nesting multiple errors *and*
including context info in the same error object.

No other error library seems to do the above while blurring the line between an
Error object and a rejected Promise object.

And no other error library allows all of the above while additionally listing an
entire stack trace with each nested error at appropriate frames, as opposed to
listing the entire trace for every error. (This will make more sense in the section on
stack traces.)

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

### new ConError((Error|Error[])?, string?, {}?)

ConError accepts an Error or array of Error, a message, and an arbitrary object. All
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

### .toString()

Equivalent to `conError.printer().stringify(conError)`

Returns a string containing the entire stack trace of the ConError instance and *the
first parents* of its cause hierarchy. That is, it will only select the first cause for
each ConError with multiple causes.

See above in Features, Stack Traces.

To stringify all lines of errors, `cerr.transform().lines().map(e => e.toString())`

To stringify all individual errors, `cerr.transform().flattened().map(e => e.toString())`

### .write((WritableStream|Console)?)

Equivalent to `conError.printer().write(writer, conError)`

Attempts to write the ConError's entire stack trace, and its cause hierarchy, to
the given writable stream. Like `.toString()`, this only selects the first parent 
in the cause hierarchy.

This attempts to use a `.write` method, first. Second, it will try to use
`.error`, so a console object can be passed to it.

If no object is not given, this will attempt to write to the global `console.error`.

To write all lines of errors, `cerr.transform().lines().forEach(e => e.write(stream))`

To write all individual errors, `cerr.transform().flattened().forEach(e => e.write(stream))`

### .printer()

Returns a `CePrinter` instance, the default printer for the ConError.

### .transform()

Returns a `CeTransform` instance with the callee as the referent object.

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

Returns the full stack of the error object. The stack is produced by
[https://github.com/stacktracejs/error-stack-parser](error-stack-parse).

## CeTransform

### .lines()

This returns an array of new ConError instances where each ConError in the hierarchy
has exactly one parent.

For example, if B failed because of two async functions, C and D, the returned array
could contain two ConError instances with hierarchies like this:

```text
before: [ A <- [B <- E, C <- D] ]

after: [
  A <- B <- E
  A <- C <- D
]
```

This only returns lines to root errors. It will not return a line ending with a ConError
containing a cause. Therefore, in the above, it would not return `[A <- B]`

### .flatten()

Returns an array of the referent ConError as well as all Error types listed as causes in the
error hierarchy.

The order will likely be stable in any given ConError object, but this
is not guaranteed. The ordering between different ConError objects and different versions
of ConError is not guaranteed to be stable.

## ConError's Promise-like behavior

The `.then` function mainly exists to make ConError appear Promise-like. The return
values are native es6 Promises (or polyfills) and can be chained as usual.

**Caveat**

The ConError itself only mimics a Promise. Most Promise libraries will check for the
`.then` function. The EcmaScript standard checks for internal states which cannot be
set by script. Therefore, most libraries will treat it as a Promise, but a native es6
`Promise.resolve(conError) !== conError`, meaning there are subtle differences.

After the first `.then`, because a native es6 Promise is returned, the behavior should
be perfectly identical.

### ConError.all(Promise[], string?, {}?)

Similar to `Promise.all`, except if any Promise instances are rejected it resolves as
a rejected Promise with a ConError instance. A message string and context info
can be optionally provided.

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

## CePrinter

Most CePrinters are created with the ConError. The printers can be modified before
printing.

### .stringify(ConError?)

See `ConError.toString()`

### .write((WritableStream|Console), ConError?)

See `ConError.write()`

### .fullStacks()

Returns a new CePrinter which will not attempt to minimize overlap in stack traces.

### .withWriters(fns)

Returns a new CePrinter which will call the given functions for writing each component.

The given functions are merged with the default functions, so not all need to be
specified to override a specific part. `.withWriters({endFrame: () => '--\n'})` is
perfectly legal.

See `CePrinter.writeTemplate`

`fns` should either be a single function which will format everything, or an object with
functions for each:

```javascript
const fns = {
  causeMsg: () => {},
  beginFrame: () => {},
  ctor: (name) => {},
  message: (message) => {},
  context: (obj, transform, indent) => {},
  stackFrame: (frameIdx, frameObj) => {},
  endFrame: () => {},
}
```

The template for writing an error frame:

```text
{{beginFrame}}{{causeMsg}}{{ctor}}{{message}}{{context}}{{stackFrames}}{{endFrame}}
```

causeMsg is only listed for nested errors, and is typically 'Caused by: '.

beginFrame and endFrame typically have no content

ctor typically is the constructor name, e.g.,: 'Error: '

message typically prints the string as-is, with a newline at the end

context typically writes the object run through JSON.stringify with {"context":context}
with a newline at the end, but prints nothing if there is no object

stackFrames typically print one per line: 'fn@filename:lineNum:colNum\n'

## Miscellany

### Message formatted strings

sprintf messages are explicitly not supported. Most sprintf placeholders are to hold things
like IDs, and these should be listed in contextual objects.

I have a few reasons for this:
1. The constructor parameter list is already long enough (Error, string, object) without
   introducing a variable list of sprintf arguments.
2. You can still use a sprintf function while building a ConError object, e.g.,
   `new ConError(sprintf('user ID %d is invalid', userId))`
3. In my own experience, most sprintf arguments for errors are to insert local values into
   the message string. This is exactly what a context object is useful for:
   `new ConError('user ID is invalid', {userId: userId})`. This has the added benefits:
   - the message string remains constant and more easily grepped
   - large context objects are rendered very nicely in browser consoles
   - adding more context is easy without trying to put values into a string form
