function osFullProvider() {
  function osFull(sequence) {
    this.stackFor = (index) => sequence[index].stack;
  }

  return osFull;
}

module.exports = osFullProvider;
