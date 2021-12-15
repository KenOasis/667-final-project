const coreDriver = require("../db/drivers/core-driver");
const ValidationError = require("../error/ValidationError");

// Checked whether the user is in a certain game.
const userInGameValidator = async (req, res, next) => {
  const user_id = req.session.userId;
  let { game_id } = req.body;
  if (game_id === undefined) {
    game_id = req.params.game_id;
  }
  try {
    const is_in_game = await coreDriver.checkUserInGame(game_id, user_id);
    if (is_in_game) {
      next();
    } else {
      const error = new ValidationError(
        "Join game failed. You are not in this game",
        403
      );
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userInGameValidator;
