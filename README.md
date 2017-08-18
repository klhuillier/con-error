# ConError - Contextual JavaScript Errors

[![Build Status](https://travis-ci.org/klhuillier/con-error.svg?branch=master)](https://travis-ci.org/klhuillier/con-error)
[![Coverage Status](https://coveralls.io/repos/github/klhuillier/con-error/badge.svg?branch=master)](https://coveralls.io/github/klhuillier/con-error?branch=master)

*Give context to your errors or the bunny gets it*

# Features

## Basic features

- rethrow and chain errors
- include an object with values from the point of an error
- behaves similar to a rejected Promise and can be used as one

## Stack traces

As an example, a call chain may be `get <- load <- refreshCart <- refreshScreen`.
If every method catches and rethrows with additional context, the resulting ConError would
print the stack trace:

```text
ConError: failed to refresh screen
Error
  at refreshScreen (screen.js:52:8)
Caused by: ConError: failed to refresh cart
Error
  at refreshCart (cart.js:52:8)
  at refreshScreen (screen.js:50:8)
Caused by: ConError: error getting cart details
  context: {
    cartId: 1
  }
Error
  at load (cart-details.js:52:8)
  at refreshCart (cart.js:50:8)
  at refreshScreen (screen.js:50:8)
Caused by: ConError: http error
  context: {
    statusCode: 500,
    response: [a large Object],
    cartId: 1,
    sessionId: 'e30d...'
  }
Error
  at handleResponse (http.js:37:8)
  at sendReq (http.js:50:10)
  at get (http.js:80:8)
  at load (cart-details.js:50:8)
  at refreshCart (cart.js:50:8)
  at refreshScreen (screen.js:50:8)
```

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
- causes (nested errors) hold the state for where the original error occurred at a lower level
- message gives a general description of what was being attempted in the frame this error
  was thrown from, and may help for locating the error without sourcemaps
- context gives a snapshot of the local variable state of the frame this error was
  thrown from
  
**ConError makes a deep clone of the given contextual object on creation.** This is to
avoid problems where values visible to the ConError creation frame are altered before the
ConError is printed or inspected in a debugger. With very large objects, you may want to
limit the properties given as context. This should be also be done to minimize noise.

Typical usage would be:

```javascript
try {
  doSomething();
} catch (e) {
  throw new ConError(e, 'error in some process', locals);
}
```

Usage as a rejected Promise, chaining a previous error:

```javascript
return promise
  .then(account => nextStep(account))
  .catch(e => new ConError(e, 'failed in nextStep to register user', {
    email: email
  }));
```

## `.causes`

A list of nested errors, if any. If there are none, this is an empty array.

## `.message`

The message the ConError was constructed with. If there was none, this is
an empty string.

## `.context`

A deep clone of the contextual object the ConError was constructed with.
If there was none, this is an empty object.

## `.stack`

The stack of this error as a string. This is stack unmodified from the
point of capture and the format varies by JS engine.

Because the stack is taken from an Error captured internally, this stack
will contain an additional line inside ConError.

## `.formats()`

Returns a `CeFormats` instance to produce outputs for this ConError.

## `.toString()`

Returns a string containing the entire stack trace of the ConError instance. At each level in
the hierarchy, it will only select and stringify the first cause. This is
the same as `cerr.formats().string()`.

To stringify all sequences of errors, `cerr.sequences().all().map(e => e.toString())`

## `.sequences()`

Returns a new `CeSequences` instance for this ConError.

## `.throw()`

`.throw` does as it says, it will throw the ConError.

Can be used when the `throw` keyword is not permitted, e.g., in a ternary:

```javascript
const clampTo100 = number =>
  number > 0 ?
    Math.min(number, 100) :
    new ConError('number not positive', {number: number}).throw();
``` 

# Promise-like behavior

The existence of the `.then` function makes ConError appear Promise-like to scripts.
The return value of `.then` is a native es6 Promise (or polyfill) and can be chained
as usual.

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

## Caveats

With native Promises, there are subtle differences. The EcmaScript standard checks for
internal states which cannot be set by script.

```javascript
Promise.resolve(conError) === conError; // true with some Promise libraries
Promise.resolve(conError) === conError; // false with native Promise
```

The inheritance chain of ConError is an Error and not a Promise. As a result, testing
with `instanceof` will indicate it is not a Promise.

```javascript
conError instanceof ConError; // true
conError instanceof Error; // true
conError instanceof Promise; // false
```

When the differences are important, one can easily make it a native Promise:

```javascript
// with Promise.reject
const rejected = Promise.reject(new ConError());
Promise.resolve(rejected) === rejected; // true
rejected instanceof Promise; // true
// or with a no-op then:
const nooped = new ConError().then(value => value);
Promise.resolve(nooped) === nooped; // true
nooped instanceof Promise; // true
```

# CeFormats

Created by a ConError with `.formats()` to encode the error for output.

## `.string()`

Returns a form of the ConError that is formatted as a plain string.

## `.object()`

Returns a form of the ConError as a plain JavaScript object. That is, an object with
no values that cannot be encoded as JSON. i.e., no functions, no DOM elements, etc.

This is the same object that is encoded by `.json()`.

## `.json(options: {}?)`

Returns a form of the ConError object serialized as JSON with the following form:

```json
{
  "name": "ConError",
  "message": "",
  "context": {},
  "stack": "",
  "causes": [
    {
      "name": "Error",
      "message": "",
      "stack": ""
    }
  ]
}
```

### json options

#### indent: number, default 0

number of spaces to indent each line, 0 = compact form

```js
cerr.formats().json({indent: 2});
```

# CeSequences

Produces sequences for the referent ConError.

A sequence is an array of errors where each error in the sequence is caused by the
next error in the sequence. e.g., the first element of a sequence may be thrown by an
on-click handler, and the last element may be an error from a remote service call
initiated by the on-click handler. `[OnClickError, ServiceError]`.

Sequences are returned as an array of Error objects, starting with the referent
ConError and possibly ending with a thrown object that is the final cause.
e.g., `[ConError, ConError, TypeError]`.

## `.first()`

This returns an array of Errors following the first cause of every ConError instance,
and possibly including another thrown object as the final cause.

## `.all()`

This returns an unsorted array of all sequences representing a full stack trace from
a root cause up to the referent error. 

More specifically, where a "root cause" is either a ConError with no cause, or another thrown type:
- every element of the array is a ConError with the same message and context as the referent ConError
- every element of the array has a chain where every ConError instance has exactly zero or one causes
- every element of the array has a chain that ends with an original root cause
- every root cause of the original ConError is returned exactly once

For example, if B failed because of two async functions, C and D, the returned array
could contain two ConError instances with hierarchies like this:

```text
before: [ A <- [ B <- E, C <- D ] ]

after: [
  [A <- B <- E],
  [A <- C <- D],
]
```
