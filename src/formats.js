const stackPreprocess = stack => stack;
const colorize = stack => stack;
const stringify = (stack, level) => JSON.stringify(stack, undefined, level);

function Formats(error, config) {
  this.error = error;
  this.config = config;
}

Formats.prototype.fullStacks = function() {
  return new Formats(this.error, {
    colorize: this.config.colorize,
    fullStacks: true,
    indent: this.config.indent,
    jsonContexts: this.config.jsonContexts,
  });
};

Formats.prototype.indent = function(level) {
  return new Formats(this.error, {
    colorize: this.config.colorize,
    fullStacks: this.config.fullStacks,
    indent: level,
    jsonContexts: this.config.jsonContexts,
  });
};

Formats.prototype.jsonContexts = function() {
  return new Formats(this.error, {
    colorize: this.config.colorize,
    fullStacks: this.config.fullStacks,
    indent: this.config.indent,
    jsonContexts: true,
  });
};

Formats.prototype.noColor = function() {
  return new Formats(this.error, {
    colorize: false,
    fullStacks: this.config.fullStacks,
    indent: this.config.indent,
    jsonContexts: this.config.jsonContexts,
  });
};

Formats.prototype.json = function() {
  return stringify(this.error.stack(), this.config.indent);
};

function newFormat(error) {
  return new Formats(error, {
    colorize: true,
    fullStacks: false,
    indent: 0,
    jsonContexts: false,
  });
}

module.exports = newFormat;
