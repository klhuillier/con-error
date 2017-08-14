function osDedupedProvider() {
  function osDeduped(sequence) {
    this.stackFor = (index) => sequence[index].stack;
  }

  return osDeduped;
}

module.exports = osDedupedProvider;
