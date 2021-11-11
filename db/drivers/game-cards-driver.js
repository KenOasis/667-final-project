const db = require('../../models/');
const Users = db['users'];
const GameUsers = db['game_users'];
const Games = db['games'];
const GameCards = db['game_cards']
const Cards = db['cards'];
const { Op } = require('sequelize');
const shuffle = require('../../util/shuffle');

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
      draw_order,
    })

    return game_card;
  }
  catch(err) {
    console.error(err);
    return null;
  }
}

exports.getCardDeck = async (game_id) => {
  try {
    const card_deck = await GameCards.findAll({
      game_id,
      in_deck: true,
      discarded: 0 
    });

    return card_deck;
  } catch (err) {
    console.error(err);
    return null;
  }
}
