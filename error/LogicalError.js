class LogicalError extends Error {
  constructor(message, http_code) {
    super(message);
    this.name = "LogicalError";
    this.http_code = http_code;
    this.date = new Date();
  }
}

module.exports = LogicalError;
