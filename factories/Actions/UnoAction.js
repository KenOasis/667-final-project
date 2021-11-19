const Action = require("./Action");

class UnoAction extends Action {
  constructor(performer) {
    super(performer);
    this._type = "uno";
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

module.exports = UnoAction;
