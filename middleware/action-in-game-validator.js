const coreDriver = require("../db/drivers/core-driver");

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
      return res.status(403).json({
        status: "Forbidden",
        message: "You action is forbidden",
      });
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};

module.exports = actionInGameValidator;
