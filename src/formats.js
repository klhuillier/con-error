const stackPreprocess = stack => stack;
const colorize = stack => stack;
const stringify = stack => JSON.stringify(stack, undefined, 0);

function Formats(error, config) {
  this.error = error;
  this.config = config;
}

Formats.prototype.fullStacks = () => new Formats(this.error, {
  colorize: this.config.colorize,
  fullStacks: true,
  indent: this.config.indent,
  jsonContexts: this.config.jsonContexts,
});

Formats.prototype.indent = level => new Formats(this.error, {
  colorize: this.config.colorize,
  fullStacks: this.config.fullStacks,
  indent: level,
  jsonContexts: this.config.jsonContexts,
});

Formats.prototype.jsonContexts = () => new Formats(this.error, {
  colorize: this.config.colorize,
  fullStacks: this.config.fullStacks,
  indent: this.config.indent,
  jsonContexts: true,
});

Formats.prototype.noColor = () => new Formats(this.error, {
  colorize: false,
  fullStacks: this.config.fullStacks,
  indent: this.config.indent,
  jsonContexts: this.config.jsonContexts,
});

Formats.prototype.json = () => stringify(this.error.stack(), this.config.indent);

function newFormat(error) {
  return new Formats(error, {
    colorize: true,
    fullStacks: false,
    indent: 0,
    jsonContexts: false,
  });
}

module.exports = newFormat;
