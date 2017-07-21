//

// TODO Mind recursion
// A single stack trace should include a full recursion stack
// Other stack traces should omit them

// TODO Mind error branching
// ex0: a() -> b() -> makeReq() is the initial error
// ex1: a() -> b() -> reqErr() is a fn that creates a new error object
// Ideally this would be:
// ex0: b -> makeReq
// ex1: a -> b -> makeError
// i.e., showing the last common ancestor
// i.e., also showing unique descendants of that ancestor

// Simple way is to work backwards from root.
// Omit all dupes shared by a parent, but do not de-dupe parents

function DedupedStack(origStack) {
  this.origStack = origStack;
}

const findIdx = (arr, predicate) => arr.reduce((acc, element, idx) => {
  if (acc === idx - 1 && predicate(element)) {
    return idx;
  }
  return acc;
}, -1);

const match = (parentElem, elem) =>
  parentElem.script === elem.script &&
  parentElem.line === elem.line &&
  parentElem.column === elem.column;

const findMatchIdxPredicate = parent => stack => findIdx(stack, elem => match(parent, elem) >= 0);

DedupedStack.prototype.stacks = stacks => stacks.map((stack, idx) => {
  const parent = idx < (stacks.length - 1) ? stacks[idx + 1] : [];
  const lastIdx = findIdx(parent, findMatchIdxPredicate);
  return stack.filter((elem, idx) => idx >= lastIdx);
});

module.exports = DedupedStack;
