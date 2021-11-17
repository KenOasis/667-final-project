const db = require("../../models/");
const Games = db["games"];
const shuffle = require("../../util/shuffle");
exports.createGame = async (name) => {
  try {
    const user = await Games.create({
      name,
    });

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.getDirection = async (id) => {
  try {
    const game = await Games.findOne({
      where: {
        id,
      },
    });
    if (game) {
      return game.direction;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.initialMatching = async (id) => {
  try {
    const game = await Games.findByPk(id);

    if (game) {
      game.matching_color = shuffle(["red", "green", "yellow", "blue"])[0];
      game.matching_number = shuffle([
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
      ])[0];
      game.save();
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

exports.getMatching = async (id) => {
  try {
    const game = await Games.findByPk(id);

    if (game) {
      const { matching_color, matching_number } = game;

      return {
        color: matching_color,
        number: matching_number,
      };
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
