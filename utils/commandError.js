function CommandError(message) {
  this.message = message;
  this.stack = new Error().stack;
}

CommandError.prototype = Object.create(Error.prototype);
CommandError.prototype.name = 'CommandError';
CommandError.prototype.constructor = CommandError();

module.exports = CommandError;
