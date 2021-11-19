const Action = require("./Action");
class PlayCardAction extends Action {
  constructor(performer, card_id) {
    super(performer);
    this._type = "play_card";
    this._card_id = card_id;
  }

  static getParams() {
    return ["performer", "card_id"];
  }

  action() {
    return {
      performer: this._performer,
      type: this._type,
      card_id: this._card_id,
    };
  }
}

module.exports = PlayCardAction;
