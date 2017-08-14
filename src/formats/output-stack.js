function outputStackProviders(osDeduped, osFull) {
  return {
    full: () => osFull(),
    deduped: () => osDeduped(),
  };
}

module.exports = outputStackProviders;
