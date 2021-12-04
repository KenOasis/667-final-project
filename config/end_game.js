const cardFactory = require("../factories/cardFactory");
const ACTION_POINT = 20;
const WILD_POINT = 50;
const getPointOfCard = (card_id) => {
  const card = cardFactory.create(card_id);
  switch (card.type) {
    case "number":
      switch (card.face_value) {
        case "zero":
          return 0;
        case "one":
          return 1;
        case "two":
          return 2;
        case "three":
          return 3;
        case "four":
          return 4;
        case "five":
          return 5;
        case "six":
          return 6;
        case "seven":
          return 7;
        case "eight":
          return 8;
        case "nine":
          return 9;
        default:
          return 0;
      }
    case "action": {
      return ACTION_POINT;
    }
    case "wild": {
      return WILD_POINT;
    }
    default:
      return 0;
  }
};

exports.getPointOfCard = getPointOfCard;
