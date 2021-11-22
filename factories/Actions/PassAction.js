const Action = require("./Action");
class PassAction extends Action {
  constructor(performer) {
    super(performer);
    this._type = "pass";
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

module.exports = PassAction;
