const db = require("../../models");
const Cards = db["cards"];

exports.getAllCardsId = async () => {
  try {
    const cards = await Cards.findAll({
      attributes: ["id"],
    });

    const card_ids = cards.map((card) => card.id);
    return card_ids;
  } catch (err) {
    console.error(err);
    return null;
  }
};
