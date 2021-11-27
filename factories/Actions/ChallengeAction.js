const Action = require("./Action");

class ChallengeAction extends Action {
  /**
   *
   * @param {number} performer performer id
   * @param {boolean} is_challenge do the challenge or not ?
   * @param {boolean} is_success if do the challenge, is it success ?
   * @param {number} penalty_player who get the penalty
   * @param {number} penalty_count how many penlalty cards
   * @param {[number]} penalty_cards card's ids
   * @param {number} receiver who is goint to receiver this update action ?
   */
  constructor(
    performer,
    is_challenge,
    is_success,
    penalty_player,
    penalty_cards,
    receiver
  ) {
    super(performer);
    (this._type = "challenge"), (this._is_challenge = is_challenge);
    if (this._is_challenge === true) {
      this._is_success = is_success;
    }

    this._penalty_player = penalty_player;
    this._receiver = receiver;
    if (this._penalty_player === this._receiver) {
      this._penalty_cards = penalty_cards.slice(0);
      this._penalty_count = penalty_cards.length;
    } else {
      this._penalty_count = penalty_cards.length;
    }
  }

  static getParams() {
    return [
      "performer",
      "is_challenge",
      "is_success",
      "penalty_player",
      "penalty_cards",
      "receiver",
    ];
  }

  action() {
    const obj = {
      performer: this._performer,
      type: this._type,
      is_challenge: this._is_challenge,
      penalty_player: this._penalty_player,
    };
    // if do challenge
    if (this._is_challenge) {
      obj.is_success = this._is_success;
    }

    // if reciever is the penalty_player
    if (this._penalty_player === this._receiver) {
      obj.penalty_cards = this._penalty_cards.slice(0);
    } else {
      obj.penalty_count = this._penalty_count;
    }

    return obj;
  }
}

module.exports = ChallengeAction;
