const cardsDriver = require("./cards-driver");
const gameCardsDriver = require("./game-cards-driver");
const gameUsersDriver = require("./game-users-driver");
const gamesDriver = require("./games-driver");
const CardFactory = require("../../factories/cardFactory");
const shuffle = require("../../util/shuffle");

exports.checkUserInGame = async (game_id, user_id) => {
  try {
    const isInGame = await gameUsersDriver.checkUserInGame(game_id, user_id);

    return isInGame;
  } catch (err) {
    throw err;
  }
};

exports.initialGame = async (game_id, users_id) => {
  try {
    // Step 1 : Generate the random sequence of starting order of user
    // referrence: async iteration https://2ality.com/2016/10/asynchronous-iteration.html
    const userIdsShuffled = shuffle(users_id);
    let userIdsOrderCounter = 1;

    for await (const user_id of userIdsShuffled) {
      await gameUsersDriver.createGameUsers(
        game_id,
        user_id,
        userIdsOrderCounter === 1 ? true : false,
        userIdsOrderCounter
      ); // Game start at the first order player
      userIdsOrderCounter += 1;
    }
    // Stpe 2: Generate the 108 game_card rows and give them an random draw order.

    const allCardsIds = await cardsDriver.getAllCardsId();

    const allCardsIdsShuffled = shuffle(allCardsIds);

    let cardIdsOrderCounter = 1;

    for await (const card_id of allCardsIdsShuffled) {
      await gameCardsDriver.initialGameCards(
        game_id,
        userIdsShuffled[0],
        card_id,
        cardIdsOrderCounter
      );

      cardIdsOrderCounter += 1;
    }

    // Step 3: initial matching
    await gamesDriver.initialMatching(game_id);

    // Step 4: initial first 7 cards of each player's card deck
    await gameCardsDriver.initialPlayersDeck(game_id);

    return true;
  } catch (err) {
    throw err;
  }
};

exports.getGameUserList = async (game_id) => {
  try {
    const game_users_list = await gameUsersDriver.getGameUsersByGameId(game_id);
    let user_list = [];
    if (game_users_list && game_users_list.length) {
      user_list = game_users_list.map((game_users) => {
        return {
          game_id: game_id,
          user_id: game_users.id,
          username: game_users.username,
        };
      });
      return user_list;
    } else {
      throw new Error("DB data error.");
    }
  } catch (err) {
    throw err;
  }
};

exports.getGameState = async (game_id, user_id) => {
  try {
    const card_deck = await gameCardsDriver.getCardDeck(game_id);
    // console.log(card_deck);

    const game_direction = await gamesDriver.getDirection(game_id);
    // console.log(game_direction);

    const game_order = await gameUsersDriver.getGameOrder(game_id);
    // console.log(game_order);

    const current_player = await gameUsersDriver.getCurrentPlayer(game_id);
    // console.log(current_player);

    const matching = await gamesDriver.getMatching(game_id);
    // console.log(matching);

    const players = await gameCardsDriver.getPlayers(game_id, user_id);
    // console.log(players);

    const discards = await gameCardsDriver.getDiscards(game_id);
    // console.log(discards);

    const undone_action = await gamesDriver.getUndoneAction(game_id);
    if (
      card_deck &&
      game_direction &&
      game_order &&
      current_player &&
      matching &&
      players &&
      discards &&
      undone_action
    ) {
      const game_state = {
        game_id,
        receiver: user_id,
        card_deck,
        game_direction,
        game_order,
        current_player,
        matching,
        players,
        discards,
        undone_action,
      };
      return game_state;
    }
  } catch (err) {
    throw err;
  }
};

exports.drawCard = async (game_id, user_id) => {
  try {
    const card_id_list = await gameCardsDriver.drawCard(game_id, user_id, 1);
    if (card_id_list && card_id_list.length === 1) {
      return card_id_list[0];
    }
  } catch (err) {
    throw err;
  }
};

exports.setUndoneActionDraw = async (game_id) => {
  try {
    const undone_action = "draw";
    const updatedResult = await gamesDriver.updateUndoneAction(
      game_id,
      undone_action
    );
    return updatedResult;
  } catch (err) {
    throw err;
  }
};

exports.setUndoneActionWildDrawFourColor = async (game_id, color) => {
  try {
    if (["red", "blue", "yellow", "green"].includes(color)) {
      const undone_action = color;
      const updatedResult = await gamesDriver.updateUndoneAction(
        game_id,
        undone_action
      );
      return updatedResult;
    } else {
      throw new Error("Invalid input");
    }
  } catch (err) {
    throw err;
  }
};
exports.resetUndoneAction = async (game_id) => {
  try {
    const undone_action = "none";
    const updatedResult = await gamesDriver.updateUndoneAction(
      game_id,
      undone_action
    );
    return updatedResult;
  } catch (err) {
    throw err;
  }
};

exports.setNextCurrent = async (game_id, user_id, action) => {
  // action type: "next" = move 1, "skip" = move 2
  const step = action === "next" ? 1 : 2;
  try {
    const direction = await gamesDriver.getDirection(game_id);
    const initial_order = await gameUsersDriver.getGameOrder(game_id);
    const mod = (n, m) => ((n % m) + m) % m;
    // js modulo has bug when n is negative
    let skip_id;
    if (direction && initial_order) {
      const current_index = initial_order.findIndex(
        (element) => element === user_id
      );
      const new_index = mod(
        current_index + direction * step,
        initial_order.length
      );
      if (step === 2) {
        const skip_index = mod(
          current_index + direction * 1,
          initial_order.length
        );
        skip_id = initial_order[skip_index];
      }

      const current_player_id = initial_order[current_index];
      const new_current_player_id = initial_order[new_index];
      await gameUsersDriver.setCurrentPlayer(game_id, current_player_id, false);
      await gameUsersDriver.setCurrentPlayer(
        game_id,
        new_current_player_id,
        true
      );
      if (step === 2) {
        return [true, skip_id];
      } else {
        return true;
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.discard = async (game_id, card_id) => {
  try {
    await gameCardsDriver.setDiscards(game_id, card_id);
  } catch (err) {
    throw err;
  }
};

exports.setMatching = async (game_id, matching_color, matching_value) => {
  try {
    const isSuccess = await gamesDriver.setMatching(
      game_id,
      matching_color,
      matching_value
    );
    return isSuccess;
  } catch (err) {
    throw err;
  }
};

exports.changeDirection = async (game_id) => {
  try {
    const isSuccess = await gamesDriver.changeDirection(game_id);
    return isSuccess;
  } catch (err) {
    throw err;
  }
};

exports.nextDrawTwo = async (game_id, user_id) => {
  try {
    const direction = await gamesDriver.getDirection(game_id);
    const initial_order = await gameUsersDriver.getGameOrder(game_id);
    const mod = (n, m) => ((n % m) + m) % m; // js modulo has bug when n is negative

    if (direction && initial_order) {
      const current_index = initial_order.findIndex(
        (element) => element === user_id
      );
      const next_index = mod(current_index + direction, initial_order.length);
      const next_player_id = initial_order[next_index];
      const draw_card_id_list = await gameCardsDriver.drawCard(
        game_id,
        next_player_id,
        2
      );

      if (draw_card_id_list && draw_card_id_list.length === 2) {
        return [draw_card_id_list, next_player_id];
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.setUno = async (game_id, user_id) => {
  try {
    const uno_status = true;
    const isSuccess = await gameUsersDriver.setUno(
      game_id,
      user_id,
      uno_status
    );
    return isSuccess;
  } catch (err) {
    throw err;
  }
};

exports.resetUno = async (game_id, user_id) => {
  try {
    const uno_status = false;
    const isSuccess = await gameUsersDriver.setUno(
      game_id,
      user_id,
      uno_status
    );
    return isSuccess;
  } catch (err) {
    throw err;
  }
};

exports.checkUnoPenalty = async (game_id, user_id) => {
  try {
    const game_cards = await gameCardsDriver.getPlayerCards(game_id, user_id);
    if (game_cards && game_cards.length) {
      if (game_cards.length != 1) {
        return [false, null];
      } else {
        const draw_card_id_list = await gameCardsDriver.drawCard(
          game_id,
          user_id,
          2
        );
        return [true, draw_card_id_list];
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.drawFour = async (game_id, user_id) => {
  try {
    const card_id_list = await gameCardsDriver.drawCard(game_id, user_id, 4);
    if (card_id_list && card_id_list.length === 4) {
      return card_id_list;
    }
  } catch (err) {
    throw err;
  }
};

exports.checkChallenge = async (game_id, user_id) => {
  try {
    const direction = await gamesDriver.getDirection(game_id);
    const initial_order = await gameUsersDriver.getGameOrder(game_id);
    const mod = (n, m) => ((n % m) + m) % m; // js modulo has bug when n is negative
    if (direction && initial_order) {
      const current_index = initial_order.findIndex(
        (element) => element === user_id
      );
      const pre_index = mod(current_index - direction, initial_order.length);
      const defended_challenger_id = initial_order[pre_index];
      const game_cards = await gameCardsDriver.getPlayerCards(
        game_id,
        defended_challenger_id
      );
      const matching = await gamesDriver.getMatching(game_id);
      if (game_cards && game_cards.length && matching) {
        const cards = game_cards.map((game_card) => game_card.card_id);
        let isMatch = false;
        for (card_id of cards) {
          const card = CardFactory.create(card_id);
          if (card.type === "number") {
            if (
              card.color === matching.color ||
              card.face_value === matching.value
            ) {
              isMatch = true;
              break;
            }
          } else if (card.type === "action") {
            if (
              card.color === matching.color ||
              card.action === matching.value
            ) {
              isMatch = true;
              break;
            }
          } else {
            // wild card, continue
            continue;
          }
        }
        let penalty_cards = [];
        if (isMatch) {
          // match existed, challenge success
          penalty_cards = await gameCardsDriver.drawCard(
            game_id,
            defended_challenger_id,
            4
          );
          return [true, defended_challenger_id, penalty_cards];
        } else {
          // match is not existed, challenge fail
          penalty_cards = await gameCardsDriver.drawCard(game_id, user_id, 6);

          return [false, user_id, penalty_cards];
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

exports.getUndoneAction = async (game_id) => {
  try {
    const undone_action = await gamesDriver.getUndoneAction(game_id);
    if (undone_action) {
      return undone_action;
    }
  } catch (err) {
    throw err;
  }
};
