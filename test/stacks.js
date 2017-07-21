const errorStackParser = require('error-stack-parser');

function FakeError(props) {
  Object.assign(this, props);
  // this.description = props.description;
  // this.message = props.message;
  // this.name = props.name;
  // this.stack = props.stack;
}

FakeError.prototype = Object.create(Error.prototype, {});

// The various browser traces are taken from
// https://raw.githubusercontent.com/stacktracejs/error-stack-parser/f246138ef57747252060b3c2555bc5d40de401af/spec/fixtures/captured-errors.js
// Included because different browser stacktraces lack various components

const errors = {};

errors.opera854 = new FakeError({
  message: 'Statement on line 44: Type mismatch (usually a non-object value used where an object is required)\n' +
  'Backtrace:\n' +
  '  Line 44 of linked script http://path/to/file.js\n' +
  '    this.undef();\n' +
  '  Line 31 of linked script http://path/to/file.js\n' +
  '    ex = ex || this.createException();\n' +
  '  Line 18 of linked script http://path/to/file.js\n' +
  '    var p = new printStackTrace.implementation(), result = p.run(ex);\n' +
  '  Line 4 of inline#1 script in http://path/to/file.js\n' +
  '    printTrace(printStackTrace());\n' +
  '  Line 7 of inline#1 script in http://path/to/file.js\n' +
  '    bar(n - 1);\n' +
  '  Line 11 of inline#1 script in http://path/to/file.js\n' +
  '    bar(2);\n' +
  '  Line 15 of inline#1 script in http://path/to/file.js\n' +
  '    foo();\n' +
  '',
  'opera#sourceloc': 44
});

errors.opera902 = new FakeError({
  message: 'Statement on line 44: Type mismatch (usually a non-object value used where an object is required)\n' +
  'Backtrace:\n' +
  '  Line 44 of linked script http://path/to/file.js\n' +
  '    this.undef();\n' +
  '  Line 31 of linked script http://path/to/file.js\n' +
  '    ex = ex || this.createException();\n' +
  '  Line 18 of linked script http://path/to/file.js\n' +
  '    var p = new printStackTrace.implementation(), result = p.run(ex);\n' +
  '  Line 4 of inline#1 script in http://path/to/file.js\n' +
  '    printTrace(printStackTrace());\n' +
  '  Line 7 of inline#1 script in http://path/to/file.js\n' +
  '    bar(n - 1);\n' +
  '  Line 11 of inline#1 script in http://path/to/file.js\n' +
  '    bar(2);\n' +
  '  Line 15 of inline#1 script in http://path/to/file.js\n' +
  '    foo();\n' +
  '',
  'opera#sourceloc': 44
});

errors.opera927 = new FakeError({
  message: 'Statement on line 43: Type mismatch (usually a non-object value used where an object is required)\n' +
  'Backtrace:\n' +
  '  Line 43 of linked script http://path/to/file.js\n' +
  '    bar(n - 1);\n' +
  '  Line 31 of linked script http://path/to/file.js\n' +
  '    bar(2);\n' +
  '  Line 18 of linked script http://path/to/file.js\n' +
  '    foo();\n' +
  '',
  'opera#sourceloc': 43
});

errors.opera964 = new FakeError({
  message: 'Statement on line 42: Type mismatch (usually non-object value supplied where object required)\n' +
  'Backtrace:\n' +
  '  Line 42 of linked script http://path/to/file.js\n' +
  '                this.undef();\n' +
  '  Line 27 of linked script http://path/to/file.js\n' +
  '            ex = ex || this.createException();\n' +
  '  Line 18 of linked script http://path/to/file.js: In function printStackTrace\n' +
  '        var p = new printStackTrace.implementation(), result = p.run(ex);\n' +
  '  Line 4 of inline#1 script in http://path/to/file.js: In function bar\n' +
  '             printTrace(printStackTrace());\n' +
  '  Line 7 of inline#1 script in http://path/to/file.js: In function bar\n' +
  '           bar(n - 1);\n' +
  '  Line 11 of inline#1 script in http://path/to/file.js: In function foo\n' +
  '           bar(2);\n' +
  '  Line 15 of inline#1 script in http://path/to/file.js\n' +
  '         foo();\n' +
  '',
  'opera#sourceloc': 42,
  stacktrace: '  ...  Line 27 of linked script http://path/to/file.js\n' +
  '            ex = ex || this.createException();\n' +
  '  Line 18 of linked script http://path/to/file.js: In function printStackTrace\n' +
  '        var p = new printStackTrace.implementation(), result = p.run(ex);\n' +
  '  Line 4 of inline#1 script in http://path/to/file.js: In function bar\n' +
  '             printTrace(printStackTrace());\n' +
  '  Line 7 of inline#1 script in http://path/to/file.js: In function bar\n' +
  '           bar(n - 1);\n' +
  '  Line 11 of inline#1 script in http://path/to/file.js: In function foo\n' +
  '           bar(2);\n' +
  '  Line 15 of inline#1 script in http://path/to/file.js\n' +
  '         foo();\n' +
  ''
});

errors.opera10 = new FakeError({
  message: 'Statement on line 42: Type mismatch (usually non-object value supplied where object required)',
  'opera#sourceloc': 42,
  stacktrace: '  Line 42 of linked script http://path/to/file.js\n' +
  '                this.undef();\n' +
  '  Line 27 of linked script http://path/to/file.js\n' +
  '            ex = ex || this.createException();\n' +
  '  Line 18 of linked script http://path/to/file.js: In function printStackTrace\n' +
  '        var p = new printStackTrace.implementation(), result = p.run(ex);\n' +
  '  Line 4 of inline#1 script in http://path/to/file.js: In function bar\n' +
  '             printTrace(printStackTrace());\n' +
  '  Line 7 of inline#1 script in http://path/to/file.js: In function bar\n' +
  '           bar(n - 1);\n' +
  '  Line 11 of inline#1 script in http://path/to/file.js: In function foo\n' +
  '           bar(2);\n' +
  '  Line 15 of inline#1 script in http://path/to/file.js\n' +
  '         foo();\n' +
  ''
});

errors.opera11 = new FakeError({
  message: '\'this.undef\' is not a function',
  stack: '<anonymous function: run>([arguments not available])@http://path/to/file.js:27\n' +
  'bar([arguments not available])@http://domain.com:1234/path/to/file.js:18\n' +
  'foo([arguments not available])@http://domain.com:1234/path/to/file.js:11\n' +
  '<anonymous function>@http://path/to/file.js:15\n' +
  'Error created at <anonymous function>@http://path/to/file.js:15',
  stacktrace: 'Error thrown at line 42, column 12 in <anonymous function: createException>() in http://path/to/file.js:\n' +
  '    this.undef();\n' +
  'called from line 27, column 8 in <anonymous function: run>(ex) in http://path/to/file.js:\n' +
  '    ex = ex || this.createException();\n' +
  'called from line 18, column 4 in printStackTrace(options) in http://path/to/file.js:\n' +
  '    var p = new printStackTrace.implementation(), result = p.run(ex);\n' +
  'called from line 4, column 5 in bar(n) in http://path/to/file.js:\n' +
  '    printTrace(printStackTrace());\n' +
  'called from line 7, column 4 in bar(n) in http://path/to/file.js:\n' +
  '    bar(n - 1);\n' +
  'called from line 11, column 4 in foo() in http://path/to/file.js:\n' +
  '    bar(2);\n' +
  'called from line 15, column 3 in http://path/to/file.js:\n' +
  '    foo();'
});

errors.opera12 = new FakeError({
  message: 'Cannot convert \'x\' to object',
  stack: '<anonymous function>([arguments not available])@http://localhost:8000/ExceptionLab.html:48\n' +
  'dumpException3([arguments not available])@http://localhost:8000/ExceptionLab.html:46\n' +
  '<anonymous function>([arguments not available])@http://localhost:8000/ExceptionLab.html:1',
  stacktrace: 'Error thrown at line 48, column 12 in <anonymous function>(x) in http://localhost:8000/ExceptionLab.html:\n' +
  '    x.undef();\n' +
  'called from line 46, column 8 in dumpException3() in http://localhost:8000/ExceptionLab.html:\n' +
  '    dumpException((function(x) new FakeError({\)n' +
  'called from line 1, column 0 in <anonymous function>(event) in http://localhost:8000/ExceptionLab.html:\n' +
  '    dumpException3();'
});

errors.opera25 = new FakeError({
  message: 'Cannot read property \'undef\' of null',
  name: 'TypeError',
  stack: 'TypeError: Cannot read property \'undef\' of null\n' +
  '    at http://path/to/file.js:47:22\n' +
  '    at foo (http://path/to/file.js:52:15)\n' +
  '    at bar (http://path/to/file.js:108:168)'
});

errors.chrome15 = new FakeError({
  'arguments': ['undef'],
  message: 'Object #<Object> has no method \'undef\'',
  stack: 'TypeError: Object #<Object> has no method \'undef\'\n' +
  '    at bar (http://path/to/file.js:13:17)\n' +
  '    at bar (http://path/to/file.js:16:5)\n' +
  '    at foo (http://path/to/file.js:20:5)\n' +
  '    at http://path/to/file.js:24:4'
});

errors.chrome36 = new FakeError({
  message: 'Default error',
  name: 'Error',
  stack: 'Error: Default error\n' +
  '    at dumpExceptionError (http://localhost:8080/file.js:41:27)\n' +
  '    at HTMLButtonElement.onclick (http://localhost:8080/file.js:107:146)'
});

errors.chrome46 = new FakeError({
  message: 'Default error',
  name: 'Error',
  stack: 'Error: Default error\n' +
  '    at new CustomError (http://localhost:8080/file.js:41:27)\n' +
  '    at HTMLButtonElement.onclick (http://localhost:8080/file.js:107:146)'
});

errors.chrome48NestedEval = new FakeError({
  message: 'message string',
  name: 'Error',
  stack: 'Error: message string\n' +
  'at baz (eval at foo (eval at speak (http://localhost:8080/file.js:21:17)), <anonymous>:1:30)\n' +
  'at foo (eval at speak (http://localhost:8080/file.js:21:17), <anonymous>:2:96)\n' +
  'at eval (eval at speak (http://localhost:8080/file.js:21:17), <anonymous>:4:18)\n' +
  'at Object.speak (http://localhost:8080/file.js:21:17)\n' +
  'at http://localhost:8080/file.js:31:13\n'
});

errors.firefox3 = new FakeError({
  fileName: 'http://127.0.0.1:8000/js/stacktrace.js',
  lineNumber: 44,
  message: 'this.undef is not a function',
  name: 'TypeError',
  stack: '()@http://127.0.0.1:8000/js/stacktrace.js:44\n' +
  '(null)@http://127.0.0.1:8000/js/stacktrace.js:31\n' +
  'printStackTrace()@http://127.0.0.1:8000/js/stacktrace.js:18\n' +
  'bar(1)@http://127.0.0.1:8000/js/file.js:13\n' +
  'bar(2)@http://127.0.0.1:8000/js/file.js:16\n' +
  'foo()@http://127.0.0.1:8000/js/file.js:20\n' +
  '@http://127.0.0.1:8000/js/file.js:24\n' +
  ''
});

errors.firefox7 = new FakeError({
  fileName: 'file:///G:/js/stacktrace.js',
  lineNumber: 44,
  stack: '()@file:///G:/js/stacktrace.js:44\n' +
  '(null)@file:///G:/js/stacktrace.js:31\n' +
  'printStackTrace()@file:///G:/js/stacktrace.js:18\n' +
  'bar(1)@file:///G:/js/file.js:13\n' +
  'bar(2)@file:///G:/js/file.js:16\n' +
  'foo()@file:///G:/js/file.js:20\n' +
  '@file:///G:/js/file.js:24\n' +
  ''
});

errors.firefox14 = new FakeError({
  message: 'x is null',
  stack: '@http://path/to/file.js:48\n' +
  'dumpException3@http://path/to/file.js:52\n' +
  'onclick@http://path/to/file.js:1\n' +
  '',
  fileName: 'http://path/to/file.js',
  lineNumber: 48
});

errors.firefox31 = new FakeError({
  message: 'Default error',
  name: 'Error',
  stack: 'foo@http://path/to/file.js:41:13\n' +
  'bar@http://path/to/file.js:1:1\n' +
  '',
  fileName: 'http://path/to/file.js',
  lineNumber: 41,
  columnNumber: 12
});

errors.firefox43NestedEval = new FakeError({
  columnNumber: 30,
  fileName: 'http://localhost:8080/file.js line 25 > eval line 2 > eval',
  lineNumber: 1,
  message: 'message string',
  stack: 'baz@http://localhost:8080/file.js line 26 > eval line 2 > eval:1:30\n' +
  'foo@http://localhost:8080/file.js line 26 > eval:2:96\n' +
  '@http://localhost:8080/file.js line 26 > eval:4:18\n' +
  'speak@http://localhost:8080/file.js:26:17\n' +
  '@http://localhost:8080/file.js:33:9'
});

errors.firefox43FunctionNameWithAtSign = new FakeError({
  message: 'Dummy error',
  name: 'Error',
  stack: 'obj["@fn"]@Scratchpad/1:10:29\n' +
  '@Scratchpad/1:11:1\n' +
  '',
  fileName: 'Scratchpad/1',
  lineNumber: 10,
  columnNumber: 29
});

errors.safari6 = new FakeError({
  message: '\'null\' is not an object (evaluating \'x.undef\')',
  stack: '@http://path/to/file.js:48\n' +
  'dumpException3@http://path/to/file.js:52\n' +
  'onclick@http://path/to/file.js:82\n' +
  '[native code]',
  line: 48,
  sourceURL: 'http://path/to/file.js'
});

errors.safari7 = new FakeError({
  message: '\'null\' is not an object (evaluating \'x.undef\')',
  name: 'TypeError',
  stack: 'http://path/to/file.js:48:22\n' +
  'foo@http://path/to/file.js:52:15\n' +
  'bar@http://path/to/file.js:108:107',
  line: 47,
  sourceURL: 'http://path/to/file.js'
});

errors.safari8 = new FakeError({
  message: 'null is not an object (evaluating \'x.undef\')',
  name: 'TypeError',
  stack: 'http://path/to/file.js:47:22\n' +
  'foo@http://path/to/file.js:52:15\n' +
  'bar@http://path/to/file.js:108:23',
  line: 47,
  column: 22,
  sourceURL: 'http://path/to/file.js'
});

errors.safari8Eval = new FakeError({
  message: 'Can\'t find variable: getExceptionProps',
  name: 'ReferenceError',
  stack: 'eval code\n' +
  'eval@[native code]\n' +
  'foo@http://path/to/file.js:58:21\n' +
  'bar@http://path/to/file.js:109:91',
  line: 1,
  column: 18
});

errors.safari9NestedEval = new FakeError({
  column: 39,
  line: 1,
  message: 'message string',
  stack: 'baz\n' +
  'foo\n' +
  'eval code\n' +
  'eval@[native code]\n' +
  'speak@http://localhost:8080/file.js:26:21\n' +
  'global code@http://localhost:8080/file.js:33:18'
});

// IE9's error doesn't have any stack trace. Oh well, it's a dead browser anyway.
// errors.ie9 = new FakeError({
//   message: 'Unable to get property \'undef\' of undefined or null reference',
//   description: 'Unable to get property \'undef\' of undefined or null reference'
// });

errors.ie10 = new FakeError({
  message: 'Unable to get property \'undef\' of undefined or null reference',
  stack: 'TypeError: Unable to get property \'undef\' of undefined or null reference\n' +
  '   at Anonymous function (http://path/to/file.js:48:13)\n' +
  '   at foo (http://path/to/file.js:46:9)\n' +
  '   at bar (http://path/to/file.js:82:1)',
  description: 'Unable to get property \'undef\' of undefined or null reference',
  number: -2146823281
});

errors.ie11 = new FakeError({
  message: 'Unable to get property \'undef\' of undefined or null reference',
  name: 'TypeError',
  stack: 'TypeError: Unable to get property \'undef\' of undefined or null reference\n' +
  '   at Anonymous function (http://path/to/file.js:47:21)\n' +
  '   at foo (http://path/to/file.js:45:13)\n' +
  '   at bar (http://path/to/file.js:108:1)',
  description: 'Unable to get property \'undef\' of undefined or null reference',
  number: -2146823281
});

errors.edge20NestedEval = new FakeError({
  description: 'message string',
  message: 'message string',
  name: 'Error',
  stack: 'Error: message string\n' +
  '  at baz (eval code:1:18)\n' +
  '  at foo (eval code:2:90)\n' +
  '  at eval code (eval code:4:18)\n' +
  '  at speak (http://localhost:8080/file.js:25:17)\n' +
  '  at Global code (http://localhost:8080/file.js:32:9)'
});

// More custom ones

errors.node8Repl = new FakeError({
  message: '',
  name: 'Error',
  stack: `  Error
    at repl:1:1
    at ContextifyScript.Script.runInThisContext (vm.js:23:33)
    at REPLServer.defaultEval (repl.js:339:29)
    at bound (domain.js:280:14)
    at REPLServer.runBound [as eval] (domain.js:293:12)
    at REPLServer.onLine (repl.js:536:10)
    at emitOne (events.js:101:20)
    at REPLServer.emit (events.js:191:7)
    at REPLServer.Interface._onLine (readline.js:241:10)
    at REPLServer.Interface._line (readline.js:590:8)`
});

errors.node8Recursive = new FakeError({
  message: 'message string',
  name: 'Error',
  stack: `  Error: server error
    at remoteResource (file.js:2:9)
    at loadResource (file.js:6:3)
    at recursive1 (file.js:11:5)
    at recursive0 (file.js:18:3)
    at recursive1 (file.js:13:5)
    at recursive0 (file.js:18:3)
    at recursive1 (file.js:13:5)
    at recursive0 (file.js:18:3)
    at script (file.js:22:3)
    at main (file.js:26:3)`
});

const parsed = {};

Object.keys(errors).forEach(key => {
  parsed[key] = errorStackParser.parse(errors[key]);
});

module.exports = {
  errors: errors,
  parsed: parsed,
};
