const Action = require("./Action");

class DrawCardAction extends Action {
  constructor(performer, card_id, receiver) {
    super(performer);
    this._type = "draw_card";
    this._receiver = receiver;
    if (this._performer === this._receiver) {
      this._card_id = card_id;
    }
  }

  static getParams() {
    return ["performer", "card_id", "receiver"];
  }
  action() {
    const obj = {
      performer: this._performer,
      type: this._type,
    };
    if (this._performer === this._receiver) {
      obj.card_id = this._card_id;
    }
    return obj;
  }
}

module.exports = DrawCardAction;
