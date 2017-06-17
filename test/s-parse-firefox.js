// example:

// Since Firefox 30 (June 2014)
// a@script.js:1:21
// b@script.js:1:21
// @debugger eval code:1:1

// Firefox 14-29 (June 2012-June 2014) did not have column numbers:
// a@script.js:1
// b@script.js:1
// @debugger eval code:1

// Earlier Firefoxes were similar to 14, but included some argument information with the function names, e.g., a("foo")@

// var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
// var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
// var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
