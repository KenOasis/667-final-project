const db = require("../../models/");
const Users = db["users"];
const GameUsers = db["game_users"];
const Games = db["games"];
const GameCards = db["game_cards"];
const Cards = db["cards"];
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const coreDriver = require("./core-driver");
const shuffle = require("../../util/shuffle");
const LogicalError = require("../../error/LogicalError");
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
  } catch (error) {
    throw error;
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
      throw new LogicalError(
        `Invalid data resource, game (game_id = ${game_id}) is not existed in game_user table`,
        404
      );
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
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
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
    if (game_users && game_users.length === 4) {
      game_users.forEach((game_user) => {
        user_ids.push(game_user.user_id);
      });
    } else {
      throw new LogicalError(
        `Invalid data resource, game (game_id = ${game_id}) is not correct in game_user table`,
        409
      );
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
        throw new LogicalError(
          `Invalid data resource, game (game_id = ${game_id}) is not existed in game_user table`,
          404
        );
      }
      if (game_cards) {
        player.number_of_cards = game_cards.length;

        if (current_user_id === user_id) {
          player.cards = game_cards.map((game_card) => game_card.card_id);
        }
      } else {
        throw new LogicalError(
          `Invalid data resource, game (game_id = ${game_id}) is not correct in game_cards table`,
          409
        );
      }
      players.push(player);
    }
    return players;
  } catch (error) {
    throw error;
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
  } catch (error) {
    throw error;
  }
};

exports.drawCard = async (game_id, user_id, number_of_cards) => {
  try {
    let game_cards = await GameCards.findAll({
      where: {
        game_id,
        in_deck: true,
        discarded: 0,
      },
      order: [["draw_order", "ASC"]],
      limit: number_of_cards,
    });

    // Not enough cards to draw, shuffle discarded cards and replendish the draw pile deck
    if (game_cards && game_cards.length < number_of_cards) {
      // get all cards in discarded pile
      const discarded_game_cards = await GameCards.findAll({
        where: {
          game_id,
          in_deck: false,
          discarded: {
            [Op.gt]: 0,
          },
        },
        order: [["draw_order", "ASC"]],
      });

      if (discarded_game_cards && discarded_game_cards.length) {
        const draw_orders = discarded_game_cards.map(
          (game_card) => game_card.draw_order
        );
        const shuffle_draw_orders = shuffle(draw_orders);
        let index_of_draw_orders = 0;
        for await (game_card of discarded_game_cards) {
          game_card.in_deck = true;
          game_card.draw_order = shuffle_draw_orders[index_of_draw_orders];
          game_card.discarded = 0;
          await game_card.save();
          index_of_draw_orders++;
        }
        // redo action of drawCard;
        game_cards = await GameCards.findAll({
          where: {
            game_id,
            in_deck: true,
            discarded: 0,
          },
          order: [["draw_order", "ASC"]],
          limit: number_of_cards,
        });
      } else {
        throw new Error("Reshuffle card failed.");
      }
    }
    if (game_cards && game_cards.length === number_of_cards) {
      for await (const game_card of game_cards) {
        game_card.user_id = user_id;
        game_card.in_deck = false;
        await game_card.save();
      }
      const draw_card_id_list = game_cards.map(
        (game_card) => game_card.card_id
      );
      // reset their uno status whenever some one draw card
      await coreDriver.resetUno(game_id, user_id);
      return draw_card_id_list;
    } else {
      throw new Error("Reshuffle card failed.");
    }
  } catch (error) {
    throw error;
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
      throw new LogicalError(
        `Invalid data resource, game (game_id = ${game_id}) is not correct in game_cards table`,
        409
      );
    }
  } catch (error) {
    throw error;
  }
};

exports.getPlayerCards = async (game_id, user_id) => {
  try {
    const game_cards = await GameCards.findAll({
      where: {
        game_id,
        user_id,
        in_deck: false,
        discarded: 0,
      },
    });
    if (game_cards) {
      return game_cards;
    } else {
      throw new Error("DB data error.");
    }
  } catch (error) {
    throw error;
  }
};
