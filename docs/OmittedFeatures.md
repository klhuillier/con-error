# ConError - Omitted Features

A quick documentation of why decisions were made to omit certain features that might
be requested.

## Message sprintf - formatted strings

Most sprintf placeholders are to hold things like IDs. As these are variables visible
to the local closure, they should be listed in contextual objects.

This keeps the message string a string literal, more easily searched for in the
code or on the web.

Keeping the contextual values in the contextual object makes it render more nicely
in object and string form in a browser, and more easily matched when in JSON form.

es2016 pretty much removes the usefulness of sprintf strings with the
format strings syntax:
```js
const msg = `user ID ${userId} is invalid`;
```

Finally, sprintf can still be done with a separate function. e.g., `sprintf` from
the NPM module `sprintf-js` allows you to do this:
    
    `new ConError(sprintf('user ID %d is invalid', userId))`

## Custom formatting

An API for extensive configuration of `CeFormat` or custom types is intentionally
omitted. There is nothing special a `CeFormat` needs for its work, and a custom type
is easily created without such an API.

Creating a full API that can handle any configuration would explode the number of
methods. With the number of filters, mappings, stack filtering and mapping, etc,
it's far more than this library is expected to do. With a domain-specific use
(e.g., creating log levels or UI/service borders), it's best to just create a
domain-specific formatter.

I would suggest using the object format to create a plain JS object first,
then mapping/filtering/etc from that object.

#### Coloring

This is a special form of custom formatting. In a terminal window, applying
syntax coloring to the context objects, and other parts of the error output
could possibly be done.

This adds a bunch of code that is not error-specific to detect a terminal
and detect color capabilities of the terminal, plus allowing a color/noColor
option to override.

If an application wants to highlight the objects, it can use another library
to highlight the output from `conError.formats().object()`.

## Deduplication of stacks

Because errors are chained together, an idea I had was to reduce the stack
lines printed to those specific to each error in the chain, with the error
messages and contexts interleaved with the stack lines.

There are too many challenges involving this to make it effective. If the
format of stack traces were standardized, or even better, if stacks came
as objects such as `{filename: 'src.js', line: 139, column: 14, ...}`,
deduplication would be much simpler. And there is a library to parse
stack traces from formats of popular browsers.

One problem is there is no guarantee formats will remain stable into the
future.

A much bigger problem is: This very library is a custom Error type with
its own `.stack` property. I am very tempted to remove the top line from
the captured traces to omit the Error creation inside ConError. And while
I am modifying the stack property, I may as well normalize the format
so it is displayed consistently across browsers...

**There is absolutely no guarantee other Error types are not applying their
own formats to their stack traces.**
