const db = require("../../models/");
const Games = db["games"];
const { Op } = require("sequelize");
const shuffle = require("../../util/shuffle");
const { sequelize } = require("../../models/");
exports.createGame = async (name) => {
  try {
    const user = await Games.create({
      name,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

exports.isActiveGame = async (game_id) => {
  try {
    const game = await Games.findOne({
      where: {
        id: game_id,
        created_at: {
          [Op.eq]: sequelize.col("finished_at"),
        },
      },
    });
    if (game) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
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
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.initialMatching = async (id) => {
  try {
    const game = await Games.findByPk(id);

    if (game) {
      game.matching_color = shuffle(["red", "green", "yellow", "blue"])[0];
      game.matching_value = shuffle([
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
        "reverse",
        "skip",
        "draw_two",
      ])[0];
      game.save();
      return true;
    } else {
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.getMatching = async (id) => {
  try {
    const game = await Games.findByPk(id);

    if (game) {
      const { matching_color, matching_value } = game;

      return {
        color: matching_color,
        value: matching_value,
      };
    } else {
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
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
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
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
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.setMatching = async (id, matching_color, matching_value) => {
  try {
    const game = await Games.findByPk(id);
    if (game) {
      game.matching_color = matching_color;
      game.matching_value = matching_value;
      await game.save();
      return true;
    } else {
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.changeDirection = async (id) => {
  try {
    const game = await Games.findByPk(id);
    if (game) {
      const current_direction = game.direction;
      game.direction = current_direction === 1 ? -1 : 1;
      await game.save();
      return true;
    } else {
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.setEndGame = async (id) => {
  try {
    const game = await Games.findByPk(id);
    if (game) {
      game.finished_at = sequelize.fn("NOW");
      await game.save();
    } else {
      throw new LogicalError(
        `Invalid data resource, game (id = ${id}) is not existed`,
        404
      );
    }
  } catch (error) {
    throw error;
  }
};
/**
 *  Lobby Drivers
 */

exports.getAllActiveGame = async () => {
  try {
    const games = await Games.findAll({
      where: {
        created_at: {
          [Op.eq]: sequelize.col("finished_at"),
        },
      },
    });
    if (games) {
      return games;
    }
  } catch (error) {
    throw error;
  }
};

exports.deleteGame = async (game_id) => {
  try {
    const game = await Games.findOne({
      where: {
        id: game_id,
        created_at: {
          [Op.eq]: sequelize.col("finished_at"),
        },
      },
    });
    if (game) {
      await game.destroy();
      return true;
    }
  } catch (error) {
    throw error;
  }
};
