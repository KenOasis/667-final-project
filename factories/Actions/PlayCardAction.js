const Action = require("./Action");
class PlayCardAction extends Action {
  constructor(performer, card) {
    super(performer);
    this._type = "play_card";
    this._card = card.slice(0);
  }

  static getParams() {
    return ["performer", "card"];
  }

  action() {
    return {
      performer: this._performer,
      type: this._type,
      card: this._card.slice(0),
    };
  }
}

module.exports = PlayCardAction;
