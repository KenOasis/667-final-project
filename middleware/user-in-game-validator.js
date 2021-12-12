const coreDriver = require("../db/drivers/core-driver");
const ValidationError = require("../error/ValidationError");
const userInGameValidator = async (req, res, next) => {
  const user_id = req.session.userId;
  const { game_id } = req.body;
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
