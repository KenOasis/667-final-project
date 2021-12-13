const cardsBulk = [];
const card_types = ["number", "action", "wild"];
const card_colors = ["red", "yellow", "green", "blue", "none"];
// const card_actions = ['no_action', 'skip','reverse','draw_two','wild','wild_draw_four'];
const card_face_values = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "none",
];

// create an array of cards for initializing the cards table in db
card_types.forEach((card_type) => {
  if (card_type === "number") {
    card_face_values.forEach((face_value) => {
      if (face_value === "none") {
        return;
      }
      card_colors.forEach((color) => {
        if (color === "none") {
          return;
        }
        const newCard = {
          type: card_type,
          color: color,
          action: "no_action",
          face_value: face_value,
        };
        if (face_value !== "zero") {
          cardsBulk.push(newCard);
        }
        cardsBulk.push(newCard);
      });
    });
  } else if (card_type === "action") {
    card_colors.forEach((color) => {
      if (color === "none") {
        return;
      }
      const actions = ["skip", "reverse", "draw_two"];
      actions.forEach((action) => {
        const newCard = {
          type: card_type,
          color: color,
          action: action,
          face_value: "none",
        };
        cardsBulk.push(newCard);
        cardsBulk.push(newCard);
      });
    });
  } else {
    // card_type === 'wild';
    const actions = ["wild", "wild_draw_four"];
    actions.forEach((action) => {
      const newCard = {
        type: card_type,
        color: "none",
        action: action,
        face_value: "none",
      };
      cardsBulk.push(newCard);
      cardsBulk.push(newCard);
      cardsBulk.push(newCard);
      cardsBulk.push(newCard);
    });
  }
});

module.exports = cardsBulk;
