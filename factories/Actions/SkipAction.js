const Action = require("./Action");

class SkipAction extends Action {
  constructor(performer) {
    super(performer);
    this._type = "skip";
  }

  static getParams() {
    return ["performer"];
  }
  action() {
    return {
      performer: this._performer,
      type: this._type,
    };
  }
}

module.exports = SkipAction;
