// An attempt to detect whether the script is loaded in Node.js or a browser.
//
// This isn't perfect because:
// - Node.js scripts can modify global.process to mimic browser environments
// - a browser shim could create a process object that mimics the Node.js object
//
// A more robust option might be to try require('fs'). However, this may give a false
// negative in Node.js in a sandboxed environment. And since we don't care about
// filesystem, this would be too restrictie.
//
// Still, this does not need to be perfect. The only real difference is in string
// outputs, where in the browser it will print the context object as-is instead of
// attempting to format with ANSI colors. The worst case scenario is it prints
// context objects in an unexpected way.

// Capture the process object in a way that won't cause web build tools to provide
// a shim.
const proc = (global || {})['\u0070rocess'] || {};

// toString is pretty solid, shims will generally provide it as [object Object].
// Can be overridden by a shim with shim.prototype.toString = () => '[object process]'.
// I don't know of a shim that does this, but it's not inconceivable. Therefore,
// additionally check for a node version. If there is one, the app is either running
// in Node.js or very much wants to pretend it is, and we shall oblige.
module.exports =
  Object.prototype.toString.call(proc) === '[object process]' &&
  typeof proc.versions === 'object' &&
  typeof proc.versions.node === 'string';
