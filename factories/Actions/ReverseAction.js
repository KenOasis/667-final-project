const Action = require("./Action");

class ReverseAction extends Action {
  constructor(performer) {
    super(performer);
    this._type = "reverse";
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

module.exports = ReverseAction;
