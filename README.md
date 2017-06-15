# ConError

## Contextual Errors in JavaScript

###### Give context to your errors or the bunny gets it

## Why Another Error Library?

Errors need to do two things:
- bubble up to prevent subsequent and calling code from executing normally
- provide information helpful for diagnosis of the problem

Other libraries provide the first, which is easy enough in JavaScript because anything
can be thrown, including `undefined`!

The second part every other library seems to be lacking in.
[VError by Joyent](https://github.com/joyent/node-verror) allows nesting of errors,
which is very helpful. But it does not have great support for nesting *and* including
context info.

## Features

ConError allows including any plain object, as well as underlying errors. 

ConError behaves as a rejected Promise and can be returned as one.

ConError will make a deep copy of any contextual object provided to it. See the section
on Cloning.

## Usage

### Overview

An example of using the main features:

*****TODO***** I don't like this, I want the ConError to be completely formed before thrown

```javascript
const ConError = require('con-error');
try {
  something();
} catch (err) {
  throw new ConError({
      userId: userId,
      service: service
    })
    .causedBy(err);
}
```

#### Cloning

Because objects can be mutated by other parts of the application, when ConError is given
its context, it attempts to make a deep clone of the context object.

This is a way of avoiding cloning very large objects:

```javascript
new ConError({
  items: cart.items.map(item => ({
    id: item.id
  }))
})
```

#### .causedBy(Error|Error[])

`.causedBy` accepts a single error or an array of errors.

Typical usage would be:

```javascript
try {
  doSomething();
} catch (e) {
  throw new ConError(locals).causedBy(e);
}
```

Usage as a rejected Promise:

```javascript
promise
  .then(() => nextStep())
  .catch(e => new ConError(locals).causedBy(e));
```

### .border()

Adding this call will mark a ConError as being a error on the border between internal
and front-end. Nested errors will be treated as internal and not printed in the console.
The error marked as border will be the final error printed to a console.

```javascript
throw new ConError(locals).internal();
```

#### CError.all(Promise[])

The hard way of handling an array of rejected promises:

```javascript
Promise.all(promises)
  .then(promises => promises.map(p => p.then(p, Error)))
  .then(results => {
    const errors = results.filter(p => p instanceof Error);
    return errors.length === 0 ? results : Promise.reject(errors);
  })
  .then(/* do something with all resolved */)
  .catch(errors => (errors.length > 0) ?
      CError(locals).causedBy(errors).throw() :
      CError(locals).throw()
  );
```

The easier way:

```javascript
CError.all(promises)
  .then(/* do something with all resolved */);
```

CError.all will act identically to Promise.all when promises are all resolved. When one
or more are rejected, it will return a new CError caused by rejections.

#### .throw()

`.throw` does as it says, it will throw the ConError.

This isn't needed when used in a block, but in a lamdba function it can be helpful
for when the `throw` keyword is not permitted. e.g.,

```javascript
const assertPositive = number =>
  number > 0 ?
    number :
    new ConError({number: number}).throw();
``` 

### Promise-like functions

These functions mainly exist to make ConError appear Promise-like. They are not intended
for direct usage.

##### .then(fn, fn)

As an error, the first callback of `.then` is never called. Most `isPromiseLike`
functions test with the `.then` function.

Some promise libraries follow the `.then(resolved, rejected)` pattern. When a rejected
callback is given, this is called after the interpreter has settled.

***WARNING***

This does *not* follow the Promise API. It is only intended for use as a rejected promise
and cannot be reliably chained. e.g., this will not work:

```javascript
fnThatReturnsCError()
  .then(opt => opt, () => defaultOption)
  .then(opt => applyOption(opt));
```

More specifically, the return value of `.then` and `.catch` is the same object. Therefore,
return values from `.then` and `.catch` callbacks will not alter the rejected value. It will
always be rejected with the same CError.


##### .catch(fn)

The callback of `.catch` is always called after the interpreter has settled. It always
calls the callback with itself as the only argument.

***WARNING***

As above in `.then(fn, fn)`, this does *not* follow the Promise API.
