const coreDriver = require("../db/drivers/core-driver");

const userInGameValidator = async (req, res, next) => {
  const user_id = req.session.userId;
  const { game_id } = req.body;
  try {
    const isInGame = await coreDriver.checkUserInGame(game_id, user_id);
    if (isInGame) {
      next();
    } else {
      res.status(403).json({
        status: "forbidden",
        message: "Join game failed. You are not in this game",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

module.exports = userInGameValidator;
