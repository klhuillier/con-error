# ConError - Contextual JavaScript Errors

###### Give context to your errors or the bunny gets it

# Features

## Basic features

- rethrow and chain errors
- include an object with values from the point of an error
- behaves similar to a rejected Promise and can be used as one
- by default, attempts to avoid noise in stack traces by listing a full
  stack trace interleaved with exceptions thrown at each point in the stack

## Stack traces

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
ConError attempts to limit the stacktrace displayed to the chains unique to each error.

# API

## Basic Usage

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

## `new ConError((Error|Error[])?, string?, {}?)`

ConError accepts an Error or array of Errors, a message, and an arbitrary object. All
values are optional, but any that are given must appear in the expected order.

All three parameters have distinct purposes in diagnosing errors:
- nested errors hold the state for where the original error occurred, lower-level
- message is useful for giving a general description of what was being attempted in
  the frame this error was thrown from (it may even be distinct enough to locate the
  exact line in the application with grep)
- context gives a snapshot of the local variable state of the frame this error was
  thrown from
  
**ConError makes a deep clone of the given contextual object on creation.** The reason for
doing this deep clone is to avoid problems where values visible to the ConError creation 
point are altered before the ConError is printed or inspected in a debugger. With very large
objects, you probably will want to limit the properties given as context.

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

## `.throw()`

`.throw` does as it says, it will throw the ConError.

Used when the `throw` keyword is not permitted, e.g., in a lamdba block:

```javascript
const clampTo100 = number =>
  number > 0 ?
    Math.min(number, 100) :
    new ConError('number not positive', {number: number}).throw();
``` 

## `.toString()`

Returns a string containing the entire stack trace of the ConError instance. At each level in
the hierarchy, it will only select and stringify the first cause.

To stringify all chains of errors, `cerr.aggregate().chains().map(e => e.toString())`

To stringify all individual errors, `cerr.aggregate().flattened().map(e => e.toString())`

## `.formats()`

Returns a `CeFormats` instance to produce outputs for this ConError.

## `.aggregate()`

Returns a `CeAggregate` instance for this ConError.

## `.causes()`

Returns a list of nested errors, if any. If there are none, this is an empty array.

## `.message()`

Returns the message the ConError was constructed with. If there was none, this is
an empty string.

## `.context()`

Returns the contextual object the ConError was constructed with. If there was none,
this is an empty object.

The object returned here is the same context object that is held by the ConError.
This is as opposed to the constructor parameter, which is cloned to capture the state
of the variables when the ConError is created.

## `.stack()`

Returns the stack of this error as an array, including stack frames of parent ConErrors.
The stack is of this form for a stack frame:

```json
{
  "function": "refresh",
  "script": "app/store/cart.js",
  "line": 50,
  "column": 8,
  "eval": false,
  "native": false
}
```

Like most stack traces, the inner-most call is the first element of the array.

# CeFormats

Created by a ConError with `.formats()`, the CeFormats has various ways of encoding the ConError.
Some methods only apply to some formats.

## Output methods

## `.string()`

Returns a form of the ConError that is formatted as a plain string.

By default, in a browser, this will not serialize context objects so that the objects will listed as
collapsible/expandable objects.

## `.object()`

Returns a form of the ConError that is formatted as a plain JavaScript object. That is, an object with
no values that cannot be encoded as JSON. i.e., no functions, no DOM elements, etc.

In Node.js, this is similar to the `.json` formatter because it transforms objects into JSON when
printed to a terminal.

## `.json()`

Returns a form of the ConError object serialized as JSON with the following form:

```json
{
  "constructor": "ConError",
  "message": "",
  "context": {},
  "stack": [
    {
      "function": "",
      "script": "",
      "line": 0,
      "column": 0,
      "eval": false,
      "native": false
    }
  ],
  "causes": [
    {
      "constructor": "Error",
      "message": "",
      "stack": []
    }
  ]
}
```

The stack frames are the same as produced by `conError.stack()`.

## Config methods

## `.maxDepth(number)`

Returns a new `CeFormat` which will only print the given number of causes.

e.g., .maxDepth(1) will show the ConError as well as the first cause error and
will not print any further causes. .maxDepth(0) only shows the referent ConError.

## `.fullStacks()`

Returns a new `CeFormat` which will print full stack traces for every error. Default behavior
is to attempt to limit the stack trace lines to those that are unique to each error.

## `.indent(number)`

#### json only

Returns a new `CeFormat` with the given indent level when writing as JSON. Default
indentation is 0 (minified).

## `.jsonContexts()`

#### string only

Returns a new `CeFormat` that converts the context objects to JSON before printing
as a string. The default is to write the objects as-is while in a browser, which may write
them as '\[Object object\]'. Outside of a browser, writing objects as JSON is the default.

## `.noColor()`

#### string only

Returns a new `CeFormat` that will not attempt to add coloring to the output.

## CeAggregate

### `.chains()`

This returns an unsorted array of new ConError instances representing a full stack trace from a root
cause up to the referent error. 

More specifically, where a "root cause" is either a ConError with no cause, or another thrown type:
- every element of the array is a ConError with the same message and context as the referent ConError
- every element of the array has a chain where every ConError instance has exactly zero or one causes
- every element of the array ends with an original root cause
- every root cause of the original ConError is returned exactly once

For example, if B failed because of two async functions, C and D, the returned array
could contain two ConError instances with hierarchies like this:

```text
before: [ A <- [ B <- E, C <- D ] ]

after: [
  A <- B <- E
  A <- C <- D
]
```

## `.flatten()`

Returns an unsorted array of the referent ConError as well as all Error types listed as causes
in the error hierarchy.

# Promise-like behavior

## Caveats

The `.then` function makes ConError appear Promise-like to scripts. The return
values are native es6 Promises (or polyfills) and can be chained as usual.

With native Promises, this has subtle differences. The EcmaScript standard checks for
internal states which cannot be set by script.

```javascript
Promise.resolve(conError) === conError; // true with some Promise libraries
Promise.resolve(conError) !== conError; // true with native Promise
```

Furthermore, the inheritance chain of ConError is an Error and not a Promise.
As a result, testing with `instanceof` will indicate it is not a Promise.

```javascript
conError instanceof Error; // true
conError instanceof Promise; // false
```

When the differences are important, one can easily make it a native Promise:

```javascript
// with Promise.resolve
const rejected = Promise.reject(new ConError());
Promise.resolve(rejected) === rejected; // true
rejected instanceof Promise; // true
// or with a no-op then:
const nooped = new ConError().then();
Promise.resolve(nooped) === nooped; // true
nooped instanceof Promise; // true
```

## `ConError.all(Promise[], string?, {}?)`

Similar to `Promise.all`, except when rejected, the ConError will contain *all* rejected
promises, not just the first.

A message string and context info can be optionally provided.

```javascript
ConError.all(promises, 'failed in loading auction lot data', {lotId: lotId})
  .then(/* do something with all resolved */);
```

The returned Promise from `ConError.all` is a native es6 Promise.

## `.then(fn, fn)`

The first callback of `.then` is never called, since a ConError instance is always rejected.

When a rejected callback is given, this is called after the interpreter has settled. The
ConError instance is given as the argument to the callback.

This will call applyOption with the resolved value of defaultOption:

```javascript
fnThatReturnsConError()
  .then(opt => opt, () => defaultOption)
  .then(opt => applyOption(opt));
```

## `.catch(fn)`

The callback is always called after the interpreter has settled.

The return value is a native Promise which will be resolved or rejected based on the callback.
