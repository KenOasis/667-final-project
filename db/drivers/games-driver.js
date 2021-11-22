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
    throw new Error(err.message);
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
    } else {
      throw new Error("DB data Error");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
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
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
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
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.getUndoneAction = async (id) => {
  try {
    const game = await Games.findOne({
      where: {
        id,
      },
    });

    if (game) {
      return game.undone_action;
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.updateUndoneAction = async (id, undone_action) => {
  try {
    const game = await Games.findByPk(id);
    if (game) {
      game.undone_action = undone_action;
      await game.save();
      return true;
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
