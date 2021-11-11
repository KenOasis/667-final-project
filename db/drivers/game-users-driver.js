const db = require('../../models/');
const Users = db['users'];
const GameUsers = db['game_users'];
const { Op } = require('sequelize');

Users.hasMany(GameUsers, { foreignKey: "user_id" });

exports.getGameUsersByUserId = async (user_id) => {
  try {
    const game_users = await Users.findAll({
      attributes: ["username", "email", "created_at", "game_users.points"],
      where: {
        user_id: user_id
      },
      include: [{
        model: GameUsers,
        attributes: [],
        required: true
      }]
    });

    return game_users;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}

 exports.getGameUsersByGameId = async (game_id) => {
  try {
    const game_users = await Users.findAll({
      game_id: game_id
    });

    return game_users;
    
  } catch (err) {
    console.error(err);
    return null;
  }
}

exports.createGameUsers = async (game_id, user_id, current_player, initial_order) => {
  try {
    const game_user = await GameUsers.create({
      game_id,
      user_id,
      current_player,
      initial_order
      });

    return game_user;
  } catch (err) {
    console.error(err);
    return null;
  }
}