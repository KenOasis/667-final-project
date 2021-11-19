const Action = require("./Action");

class WildAction extends Action {
  constructor(performer, color) {
    super(performer);
    this._type = "wild";
    this._color = color;
  }

  static getParams() {
    return ["performer", "color"];
  }

  action() {
    return {
      performer: this._performer,
      type: this._type,
      color: this._color,
    };
  }
}

module.exports = WildAction;
