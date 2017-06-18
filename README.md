# ConError - Contextual JavaScript Errors

###### Give context to your errors or the bunny gets it

## Features

### Basic features

ConError:
- by default, attempts to avoid noise in stack traces by listing a full
  stack trace interleaved with exceptions thrown at each point in the stack
- behaves similar to a rejected Promise and can usually be returned as one
- allows including any plain object
- allows chaining errors together
- ships with multiple printing and aggregation methods

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
ConError attempts to limit the stacktrace displayed to the chains unique to each error.

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

### .throw()

`.throw` does as it says, it will throw the ConError.

Used when the `throw` keyword is not permitted, e.g., in a lamdba block:

```javascript
const assertPositive = number =>
  number > 0 ?
    number :
    new ConError('number not positive', {number: number}).throw();
``` 

### .print((Console|WritableStream|(...any) => void))

Attempts to write the ConError's entire stack trace, and its cause hierarchy, to
the given console's `.error`. This only selects the first parent at each level in the cause
hierarchy.

Equivalent to calling `conError.printers().mixed().print()` in a browser, or
`conError.printers().string().print()` in a terminal.

To write all chains of errors, `cerr.aggregate().chains().forEach(e => e.print(console))`

To write all individual errors, `cerr.aggregate().flattened().forEach(e => e.print(console))`

### .toString()

Returns a string containing the entire stack trace of the ConError instance. At each level in
the hierarchy, it will only select and stringify the first cause.

To stringify all chains of errors, `cerr.aggregate().chains().map(e => e.toString())`

To stringify all individual errors, `cerr.aggregate().flattened().map(e => e.toString())`

### .printers()

Returns a `CePrinters` object to provide a printer object for this ConError.

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
stack is of this form for a single stack frame:

```json
[
  {
    "function": "refresh",
    "script": "app/store/cart.js",
    "line": 50,
    "column": 8,
    "eval": false,
    "native": false
  }
]
```

## CePrinters

A provider of printers for a ConError. The returned printer will be specific to the ConError
that created it.

### .json()

Returns a `CeJsonPrinter` that will write as a JSON object.

### .object()

Returns a `CePojoPrinter` that will write as a plain JavaScript object. That is, an object with
no values that cannot be encoded as JSON. i.e., no functions, no DOM elements, etc.

### .string()

Returns a `CeStringPrinter` that will write as a plain string.

### .mixed()

Returns a `CeMixedPrinter` that will write mostly the same as `CeStringPrinter`, but will not
serialize context objects so that in browser consoles the objects will listed as
collapsible/expandable objects.


## CePrinter

Various printers which can write the contents of a ConError.

Not every printer supports every method. e.g., a JSON printer does not support colorizing.

All printers support:

### .print((Console|WritableStream|(...any) => void))?)

Simply encodes and writes the ConError to the given output.

### .maxDepth(number)

Returns a new instance of the printer which will only print the given number
of causes.

e.g., .maxDepth(1) will show the ConError as well as the first cause error and
will not print any further causes. .maxDepth(0) only shows the referent ConError.

### .fullStacks()

Returns a new printer which will print full stack traces for every error. Default behavior
is to attempt to limit the stack trace lines to those that are unique to each error.

## CeJsonPrinter

Serializes the entire ConError object as Json with the following form:

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

Without calling `.indent`, there is no guarantee of whitespaces, only that the returned
string is valid JSON.

The stack frames are the same as produced by `.stack()`.

### .indent(number)

Returns a new CeJsonPrinter with the given indent level. undefined or 0 will return
a minified form.

## CePojoPrinter

Writes a JS object containing the entirety of the ConError's hierarchy. This
is similar to calling `JSON.parse()` with the output of `conError.printers().json().print()`,
but is not guaranteed to produce exactly the same result. The result's constructors will all
be `Object` and no non-serializable values will be returned, such as DOM elements or functions:
`$('<div>')` or `() => false`.

When written in a browser console, this may support property collapsing/expansion.

## CeStringPrinter

Writes a string form of the error and stack traces.

### .highlighted()

Returns a new instance of this printer that will attempt to add coloring to the output
string.

In a browser, this will use CSS styling, and in a terminal this will use ANSI colors.

## CeMixedPrinter

This is mostly a subtype of CeStringPrinter, except that when it prints the context objects, it
will print them as objects and not as serialized forms of the objects. In browser consoles, this
makes them collapsible/expandable.

### .highlighted()

Same as `CeStringPrinter`.

Returns a new instance of this printer that will attempt to add coloring to the output
string.

In a browser, this will use CSS styling, and in a terminal this will use ANSI colors.

## CeAggregate

### .chains()

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

**Caveats: Promise differences**

The EcmaScript standard checks for internal states which cannot be set by script.
The return value of `.then` is a native Promise, so the following comparisons evaluate
to true:

```javascript
Promise.resolve(conError) !== conError; // true

const native = conError.then(() => {}, () => {});

Promise.resolve(native) === native; // true
```

ConError appears as an `instanceof Error`. It is not an `instanceof Promise`.

```javascript
conError instanceof Error; // true
conError instanceof Promise; // false
(conError.then(() => {}, () => {})) instanceof Promise; // true
```

### ConError.all(Promise[], string?, {}?)

Similar to `Promise.all`, except when rejected, the ConError will contain *all* rejected
promises, not just the first.

A message string and context info can be optionally provided.

```javascript
ConError.all(promises, 'failed in loading auction lot data', {lotId: lotId})
  .then(/* do something with all resolved */);
```

The returned Promise from `ConError.all` is a native es6 Promise.

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
