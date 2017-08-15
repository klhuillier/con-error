const formatCe = (conError) => ({
  name: conError.name,
  message: conError.message,
  context: conError.context,
  parsedStack: conError.parsedStack(),
  causes: conError.causes.map(objectFormat),
});

const formatErr = (error) => ({
  name: error.name,
  message: error.message,
  stack: error.stack,
});

function objectFormat(error) {
  if (typeof error.parsedStack === 'function' && Array.isArray(error.causes)) {
    return formatCe(error);
  }
  return formatErr(error);
}

module.exports = objectFormat;
