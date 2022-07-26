const Action = require("./Action");

class DrawTwoAction extends Action {
  constructor(performer, cards, receiver) {
    super(performer);
    this._type = "draw_two";
    this._receiver = receiver;
    if (this._performer === this._receiver) {
      this._cards = cards.slice(0);
    }
  }
  static getParams() {
    return ["performer", "cards", "receiver"];
  }
  action() {
    const obj = {
      performer: this._performer,
      type: this._type,
    };
    if (this._performer === this._receiver) {
      obj.cards = this._cards.slice(0);
    }
    return obj;
  }
}

module.exports = DrawTwoAction;
