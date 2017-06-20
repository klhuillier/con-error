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

Finally, sprintf can still be done with a separate function. e.g., `sprintf` from
the NPM module `sprintf-js` allows you to do this:
    
    `new ConError(sprintf('user ID %d is invalid', userId))`

## Custom formatting

An API for a custom `CeFormat` is intentionally omitted. There is nothing special a
`CeFormat` needs for its work, and a custom type is easily created without such an API.

I would suggest using `CeObjectFormat` to create a plain JS object form first,
then mapping/filtering/etc from that object.
