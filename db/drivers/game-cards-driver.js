const db = require("../../models/");
const Users = db["users"];
const GameUsers = db["game_users"];
const Games = db["games"];
const GameCards = db["game_cards"];
const Cards = db["cards"];
const { Op } = require("sequelize");
const sequelize = require("sequelize");

Users.hasMany(GameUsers, { foreignKey: "user_id" });
Games.hasMany(GameUsers, { foreignKey: "game_id" });

Users.hasMany(GameCards, { foreignKey: "user_id" });

Games.hasMany(GameCards, { foreignKey: "game_id" });

Cards.hasMany(GameCards, { foreignKey: "card_id" });

exports.initialGameCards = async (game_id, user_id, card_id, draw_order) => {
  try {
    const game_card = await GameCards.create({
      game_id,
      user_id,
      card_id,
      draw_order,
    });
    return game_card;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.initialPlayersDeck = async (game_id) => {
  try {
    const game_users = await GameUsers.findAll({
      where: {
        game_id,
      },
    });

    let user_ids;

    if (game_users && game_users.length) {
      user_ids = game_users.map((game_user) => game_user.user_id);
    } else {
      throw new Error("DB data error.");
    }

    for await (const user_id of user_ids) {
      const game_cards = await GameCards.findAll({
        where: {
          game_id,
          in_deck: true,
          discarded: 0,
        },
        order: [["draw_order", "ASC"]],
        limit: 7,
      });
      for await (const game_card of game_cards) {
        game_card.user_id = user_id;
        game_card.in_deck = false;
        await game_card.save();
      }
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.getCardDeck = async (game_id) => {
  try {
    const card_deck = await GameCards.count({
      where: {
        game_id,
        in_deck: true,
        discarded: 0,
      },
    });

    return card_deck;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.getPlayers = async (game_id, current_user_id) => {
  try {
    const game_users = await GameUsers.findAll({
      where: {
        game_id,
      },
    });
    let user_ids = [];
    if (game_users && game_users.length) {
      game_users.forEach((game_user) => {
        user_ids.push(game_user.user_id);
      });
    } else {
      throw new Error("DB data error.");
    }
    const players = [];
    for await (const user_id of user_ids) {
      const game_user = await GameUsers.findOne({
        where: {
          game_id,
          user_id,
        },
      });
      const game_cards = await Cards.findAll({
        raw: true,
        attributes: [
          "type",
          "color",
          "face_value",
          "game_cards.user_id",
          "game_cards.card_id",
        ],
        include: {
          model: GameCards,
          where: {
            game_id,
            user_id,
            in_deck: false,
            discarded: 0,
          },
          attributes: [],
          required: true,
        },
        order: [
          ["color", "ASC"],
          ["face_value", "ASC"],
          ["type", "ASC"],
        ],
      });
      const player = {};

      if (game_user) {
        player.user_id = game_user.user_id;
        player.uno = game_user.uno;
      } else {
        throw new Error("DB data error.");
      }
      if (game_cards && game_cards.length) {
        player.number_of_cards = game_cards.length;

        if (current_user_id === user_id) {
          player.cards = game_cards.map((game_card) => game_card.card_id);
        }
      } else {
        throw new Error("DB data error.");
      }
      players.push(player);
    }
    return players;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.getDiscards = async (game_id) => {
  try {
    const game_cards = await GameCards.findAll({
      where: {
        game_id,
        discarded: {
          [Op.gt]: 0,
        },
      },
      order: [["discarded", "DESC"]],
      limit: 3,
    });

    let discards = [];
    if (game_cards && game_cards.length) {
      game_cards.forEach((game_card) => {
        discards.push(game_card.card_id);
      });
      return discards;
    } else if (game_cards) {
      return discards;
    }
    throw new Error("DB data error. ");
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.drawCard = async (game_id, user_id) => {
  try {
    const game_card = await GameCards.findOne({
      where: {
        game_id,
        in_deck: true,
        discarded: 0,
      },
      order: [["draw_order", "ASC"]],
    });

    if (game_card) {
      game_card.user_id = user_id;
      game_card.in_deck = false;
      await game_card.save();
      return game_card.card_id;
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

exports.setDiscards = async (game_id, card_id) => {
  try {
    const game_card_max_discarded = await GameCards.findOne({
      attributes: [
        [sequelize.fn("max", sequelize.col("discarded")), "discarded"],
      ],
      where: {
        game_id,
      },
    });
    const game_card = await GameCards.findOne({
      where: {
        game_id,
        card_id,
      },
    });
    if (game_card_max_discarded && game_card) {
      game_card.discarded = game_card_max_discarded.discarded + 1;
      await game_card.save();
    } else {
      throw new Error("DB data error.!");
    }
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};
