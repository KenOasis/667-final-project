const cardsBulk = require("../db/cards_bulk");

class Card {
  constructor(id, type, color, action, face_value) {
    this._id = id;
    this._type = type;
    this._color = color;
    this._action = action;
    this._face_value = face_value;
  }

  get id() {
    return this._id;
  }
  get type() {
    return this._type;
  }
  get color() {
    return this._color;
  }
  get action() {
    return this._action;
  }
  get face_value() {
    return this._face_value;
  }
}

const cardsMap = new Map();
let idCounter = 1;
cardsBulk.forEach((card) => {
  cardsMap.set(idCounter, card);
  idCounter++;
});

/**
 * This class is used for generate the card class
 * which reducing times of query to the db to get
 * the card data.
 */

class CardFactory {
  #cards = cardsMap;
  create(card_id) {
    let card = this.#cards.get(card_id);
    if (card !== undefined) {
      return new Card(
        card_id,
        card.type,
        card.color,
        card.action,
        card.face_value
      );
    } else {
      // TODO reconstruct it from the db (update #cards);
      return null;
    }
  }
}

module.exports = new CardFactory();

// //testcode
// const factory = new CardFactory();
// const card = factory.create(66);
// console.log({
//   id: card.id,
//   type: card.type,
//   color: card.color,
//   action: card.action,
//   face_value: card.face_value
// });
