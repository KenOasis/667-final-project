const db = require('../../models/');
const Users = db['users'];
const GameUsers = db['game_users'];
const Games = db['games'];
const GameCards = db['game_cards']
const Cards = db['cards'];
const { Op } = require('sequelize');

Users.hasMany(GameUsers, { foreignKey: "user_id" });
Games.hasMany(GameUsers, { foreignKey: "game_id" });

Users.hasMany(GameCards, { foreignKey: "user_id" })

Games.hasMany(GameCards, { foreignKey: "game_id" });

Cards.hasMany(GameCards, { foreignKey: "card_id" });

exports.initialGameCards = async (game_id, user_id, card_id, draw_order) => {
  try {
    const game_card = await GameCards.create({
      game_id,
      user_id,
      card_id,
      draw_order
    })

    return game_card;
  }
  catch(error) {
    console.error(err);
    return null;
  }
}
