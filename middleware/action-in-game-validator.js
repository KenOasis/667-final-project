const coreDriver = require("../db/drivers/core-driver");
const ValidationError = require("../error/ValidationError");
// Checked the action in game validility
// whether the user is the current player
// whether the card is in user's own deck
// whether the card played is matching the matching color and/or value (face value/action type)
// Check coreDriver.checkActionValidation() for more detail.
const actionInGameValidator = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user_id = req.session.userId;
  const card_id = +req.body.card_id;
  try {
    const is_action_valid = await coreDriver.checkActionValidation(
      game_id,
      user_id,
      req.url === "/playcard" ? card_id : 0
    );
    if (!is_action_valid) {
      const error = new ValidationError(
        `Game action request ${req.url} is invalid.`,
        403
      );
      throw error;
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = actionInGameValidator;
