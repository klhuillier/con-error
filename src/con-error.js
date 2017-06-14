function ConError() {
}

ConError.prototype = Object.create(Error.prototype, {});

module.exports = ConError;
