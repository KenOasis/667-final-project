const Action = require("./Action");

class UnoPenaltyAction extends Action {
  constructor(performer, cards, receiver) {
    super(performer);
    this._type = "uno_penalty";
    this._receiver = receiver;
    if (this._performer === this._receiver) {
      this._cards = cards.slice(0);
    }
  }

  action() {
    const obj = {
      performer: this._performer,
      type: this._type,
    };
    if (thie._performer === this._receiver) {
      obj.cards = this._cards.slice(0);
    }

    return obj;
  }
}

module.exports = UnoPenaltyAction;

module.exports = UnoPenaltyAction;
