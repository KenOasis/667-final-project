const Action = require("./Action");

class DrawCardAction extends Action {
  constructor(performer, card, receiver) {
    super(performer);
    this._type = "draw_card";
    this._receiver = receiver;
    if (this._performer === this._receiver) {
      this._card = card.slice(0);
    }
  }

  static getParams() {
    return ["performer", "card", "receiver"];
  }
  action() {
    const obj = {
      performer: this._performer,
      type: this._type,
    };
    if (this._performer === this._receiver) {
      obj.card = this._card.slice(0);
    }
    return obj;
  }
}

module.exports = DrawCardAction;
