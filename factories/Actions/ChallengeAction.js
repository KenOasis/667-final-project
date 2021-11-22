const Action = require("./Action");

class ChallengeAction extends Action {
  /**
   *
   * @param {number} performer performer id
   * @param {boolean} is_challenged do the challenge or not ?
   * @param {boolean} is_success if do the challenge, is it success ?
   * @param {number} penalty_player who get the penalty
   * @param {number} penalty_count how many penlalty cards
   * @param {[number]} penalty_cards card's ids
   * @param {number} receiver who is goint to receiver this update action ?
   */
  constructor(
    performer,
    is_challenged,
    is_success,
    penalty_player,
    penalty_count,
    penalty_cards,
    receiver
  ) {
    super(performer);
    (this._type = "challenge"), (this._is_challenged = is_challenged);
    if (this._is_challenged === true) {
      this._is_success = is_success;
    }

    this._penalty_player = penalty_player;
    this._penalty_count = penalty_count;
    this._receiver = receiver;
    if (this._penalty_player === this._receiver) {
      this._penalty_cards = penalty_cards.slice(0);
    }
  }

  static getParams() {
    return [
      "performer",
      "is_challenged",
      "is_success",
      "penalty_player",
      "penalty_count",
      "penalty_cards",
      "receiver",
    ];
  }

  action() {
    const obj = {
      performer: this._performer,
      type: this._type,
      is_challenged: this._is_challenged,
      penalty_player: this._penalty_player,
      penalty_count: this._penalty_count,
    };
    // if do challenge
    if (this._is_challenged) {
      obj.is_success = this._is_success;
    }

    // if reciever is the penalty_player
    if (this._penalty_player === this._receiver) {
      obj.penalty_cards = this._penalty_cards.slice(0);
    }

    return obj;
  }
}

module.exports = ChallengeAction;
