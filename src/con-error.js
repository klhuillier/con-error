// ISC License
//
// Copyright (c) 2017, Kevin L'Huillier <klhuillier@gmail.com>
//
// Permission to use, copy, modify, and/or distribute this software for any
//   purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
//   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
//   INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
// OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

// TODO grouping with something like console.group (support is spotty, Node.js doesn't support it, so a custom printer type is needed)
// TODO with multiple exceptions, separate complete stack traces are needed... that is, 1 nests (2,3), it should print (1,2) followed by (1,3)

// The multiple exceptions feature is to avoid confusion. With multiple exceptions being thrown by nested types,
// I don't want to see:
//
// Failed to load auction data
// [stack trace]
// - Caused by Failed to load lot data
// - [stack trace]
// - - Caused by Failed to load item data
// - - [stack trace]
// - - [further nesting]
// - - Caused by Failed to load bid data
// - - [stack trace]
// - - [further nesting]
// - Caused by Failed to load user data
// - [stack trace]
// - [further nesting]
//
// This obscures the fact that there are actually three separate exceptions being thrown, and makes it difficult to
// tell which exceptions nested exceptions are the cause of. I would rather see this:
//
// Failed to load auction data
// [stack trace]
// - Caused by Failed to load lot data
// - [stack trace]
// - - Caused by Failed to load item data
// - - [stack trace]
// - - [further nesting]
//
// Failed to load auction data
// [stack trace]
// - Caused by Failed to load lot data
// - [stack trace]
// - - Caused by Failed to load bid data
// - - [stack trace]
// - - [further nesting]
//
// Failed to load auction data
// [stack trace]
// - Caused by Failed to load user data
// - [stack trace]
// - [further nesting]


// TODO Remove duplicates from nested stack traces, except for last dupe

function ConError() {
}

ConError.prototype = Object.create(Error.prototype, {});
// Explicitly set the name for minification
ConError.prototype.name = 'ConError';

module.exports = ConError;
