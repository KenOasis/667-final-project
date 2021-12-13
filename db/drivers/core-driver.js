const cardsDriver = require("./cards-driver");
const gameCardsDriver = require("./game-cards-driver");
const gameUsersDriver = require("./game-users-driver");
const gamesDriver = require("./games-driver");
const CardFactory = require("../../factories/cardFactory");
const { getPointOfCard } = require("../../config/end_game");
const shuffle = require("../../util/shuffle");

/**
 * Check whether a certain user is in a certain game
 * @param {number} game_id
 * @param {number} user_id
 * @returns true for user in game, otherwise return false
 */
exports.checkUserInGame = async (game_id, user_id) => {
  try {
    const is_in_game = await gameUsersDriver.checkUserInGame(game_id, user_id);
    return is_in_game;
  } catch (error) {
    throw error;
  }
};
/**
 * Check whether an action in game (pass/playcard/challenge/sayuno) is valid or not
 * @param {number} game_id
 * @param {number} user_id
 * @param {number} card_id
 * @returns true for valid, false for invalid
 */
exports.checkActionValidation = async (game_id, user_id, card_id = 0) => {
  try {
    // check current
    let is_current_player = false;
    const current_player = await gameUsersDriver.getCurrentPlayer(game_id);
    if (current_player === user_id) {
      is_current_player = true;
    }
    if (card_id === 0 && current_player) {
      return true;
    } else if (card_id !== 0) {
      const player_cards = await gameCardsDriver.getPlayerCards(
        game_id,
        user_id
      );
      const cards = player_cards.map((card) => card.card_id);
      // check in-hand
      const is_card_onhand = cards.includes(card_id);
      const matching = await gamesDriver.getMatching(game_id);
      let is_card_matching = false;
      const Card = CardFactory.create(card_id);
      // check matching
      if (
        Card.type === "number" &&
        (Card.color === matching.color || Card.face_value === matching.value)
      ) {
        is_card_matching = true;
      } else if (
        Card.type === "action" &&
        (Card.color === matching.color || Card.action === matching.value)
      ) {
        is_card_matching = true;
      } else if (Card.type === "wild") {
        is_card_matching = true;
      }

      if (is_card_onhand && is_card_matching) {
        return true;
      }
    }
    return false;
  } catch (error) {
    throw error;
  }
};

/**
 * Check whether tha game is active (not finished)
 * @param {number} game_id
 * @returns
 * return true for active game, false for inactive game
 */
exports.isActiveGame = async (game_id) => {
  try {
    const is_active = await gamesDriver.isActiveGame(game_id);
    return is_active;
  } catch (error) {
    throw error;
  }
};

/**
 * Initialize the game after the game is full;
 * @param {number} game_id
 * @param {number} users_id
 * @returns
 * return true for successfullly initialized the game.
 * If initialization is failed, it will throw an error
 */
exports.initialGame = async (game_id, users_id) => {
  try {
    // Step 1 : Generate the random sequence of starting order of user
    // referrence: async iteration https://2ality.com/2016/10/asynchronous-iteration.html
    const user_id_list_shuffled = shuffle(users_id);
    let game_order_counter = 1;

    for await (const user_id of user_id_list_shuffled) {
      await gameUsersDriver.updateGameUsers(
        game_id,
        user_id,
        game_order_counter === 1 ? true : false,
        game_order_counter
      ); // Game start at the first order player
      game_order_counter += 1;
    }
    // Stpe 2: Generate the 108 game_card rows and give them an random draw order.

    const card_id_list = await cardsDriver.getAllCardsId();

    const card_id_list_shuffled = shuffle(card_id_list);

    let draw_order_counter = 1;

    for await (const card_id of card_id_list_shuffled) {
      await gameCardsDriver.initialGameCards(
        game_id,
        user_id_list_shuffled[0], // initial value to match the table unqiue check
        card_id,
        draw_order_counter
      );

      draw_order_counter += 1;
    }

    // Step 3: initial matching
    await gamesDriver.initialMatching(game_id);

    // Step 4: initial first 7 cards of each player's card deck
    await gameCardsDriver.initialPlayersDeck(game_id);

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * get an obj representing the game_id and user info
 * @param {number} game_id
 * @returns
 * An array of obj which elements are
 * ```
 * {
 *    game_id: number,
 *    user_id: number,
 *    username: string
 * }
 * ```
 */
exports.getGameUserList = async (game_id) => {
  try {
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    let user_list = [];
    if (game_users && game_users.length) {
      user_list = game_users.map((game_user) => {
        return {
          game_id: game_id,
          user_id: game_user.id,
          username: game_user.username,
        };
      });
      return user_list;
    } else {
      const error = new LogicalError(
        `Invalid data resource, ${game_id} is not existed in game_users table`,
        404
      );
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Get the game state obj for a certern user in a certain game
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * An game state obj (check "/factories/Actions/actionExample")
 */
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
      card_deck >= 0 &&
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
  } catch (error) {
    throw error;
  }
};

/**
 * Draw a card in the card pile
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * The id of the card.
 */
exports.drawCard = async (game_id, user_id) => {
  try {
    const card_id_list = await gameCardsDriver.drawCard(game_id, user_id, 1);
    if (card_id_list && card_id_list.length === 1) {
      return card_id_list[0];
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Set undone_action as "draw" after the draw card action
 * @param {number} game_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.setUndoneActionDraw = async (game_id) => {
  try {
    const undone_action = "draw";
    const updated_result = await gamesDriver.updateUndoneAction(
      game_id,
      undone_action
    );
    return updated_result;
  } catch (error) {
    throw error;
  }
};

/**
 * Set the undone_action as given color ("red" | "blue" | "green" | "yellow") for the wild draw four action
 * @param {number} game_id
 * @param {string} color
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.setUndoneActionWildDrawFourColor = async (game_id, color) => {
  try {
    if (["red", "blue", "yellow", "green"].includes(color)) {
      const undone_action = color;
      const updated_result = await gamesDriver.updateUndoneAction(
        game_id,
        undone_action
      );
      return updated_result;
    } else {
      throw new Error("Invalid input");
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Rest the undone action to "none"
 * @param {number} game_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.resetUndoneAction = async (game_id) => {
  try {
    const undone_action = "none";
    const updated_result = await gamesDriver.updateUndoneAction(
      game_id,
      undone_action
    );
    return updated_result;
  } catch (error) {
    throw error;
  }
};

/**
 * Change the current player of the given game
 * ```
 * action === "next" : current player move to next player
 * action === "skip" : current player move to next next player
 * ```
 * @param {number} game_id
 * @param {number} user_id // current player
 * @param {string} action
 * @returns
 * Return true if action === "next" and executed successfully;
 * [true, number] if action === "skip", the seconde element of returned array is the user id which has been skipped; throws an error if executed fail
 */
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
  } catch (error) {
    throw error;
  }
};

/**
 * Discard a card in the game
 * @param {number} game_id
 * @param {number} card_id
 * Throws an error if executed fail
 */
exports.discard = async (game_id, card_id) => {
  try {
    await gameCardsDriver.setDiscards(game_id, card_id);
  } catch (error) {
    throw error;
  }
};

/**
 * Set the matching color and matching value of the game
 * @param {number} game_id
 * @param {string} matching_color
 * @param {string} matching_value
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.setMatching = async (game_id, matching_color, matching_value) => {
  try {
    const is_success = await gamesDriver.setMatching(
      game_id,
      matching_color,
      matching_value
    );
    return is_success;
  } catch (err) {
    throw err;
  }
};

/**
 * Change the game direction of a game
 * @param {number} game_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.changeDirection = async (game_id) => {
  try {
    const is_success = await gamesDriver.changeDirection(game_id);
    return is_success;
  } catch (err) {
    throw err;
  }
};

/**
 * For a given user in a given game, the next player of the given user will draw two cards
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * Return an array has two elements:
 * First element is an array of card id which drawed from the card pile.
 * Second element is the user id of next player (who drawed the cards)
 */
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

/**
 * Set the uno status of given user in the given game as true.
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.setUno = async (game_id, user_id) => {
  try {
    const uno_status = true;
    const is_success = await gameUsersDriver.setUno(
      game_id,
      user_id,
      uno_status
    );
    return is_success;
  } catch (err) {
    throw err;
  }
};

/**
 * Reset the uno status of given user in the given game as false.
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.resetUno = async (game_id, user_id) => {
  try {
    const current_uno_status = await gameUsersDriver.getUnoStatus(
      game_id,
      user_id
    );
    if (current_uno_status === true) {
      const is_success = await gameUsersDriver.setUno(game_id, user_id, false);
      return is_success;
    } else {
      // uno status is true
      return true;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Check whether the player is getting penalty cards (Forget to say uno before he/she played the second last card)
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * If not getting the penalty it will return false, otherwise will return [true, draw_card_id_list]
 */
exports.checkUnoPenalty = async (game_id, user_id) => {
  try {
    const game_cards = await gameCardsDriver.getPlayerCards(game_id, user_id);
    const uno_status = await gameUsersDriver.getUnoStatus(game_id, user_id);
    if (game_cards && game_cards.length) {
      if (game_cards.length == 1 && uno_status === false) {
        const draw_card_id_list = await gameCardsDriver.drawCard(
          game_id,
          user_id,
          2
        );
        return [true, draw_card_id_list];
      }
    }
    return [false, null];
  } catch (err) {
    throw err;
  }
};

/**
 * Drawed four card for a given user in a given game
 * @param {number} game_id
 * @param {bynber} user_id
 * @returns
 * Return an array of card id if success; otherwise it will throw an error
 */
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

/**
 * Get the next player(user)'s id of a given user of a given game based on the current
 * direction and initial order of the game
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * Return the user id of next player if executed successfully; otherwise it will throw an error
 */
exports.getNextPlayerId = async (game_id, user_id) => {
  try {
    const direction = await gamesDriver.getDirection(game_id);
    const initial_order = await gameUsersDriver.getGameOrder(game_id);
    const mod = (n, m) => ((n % m) + m) % m; // js modulo has bug when n is negative
    if (direction && initial_order && initial_order.length) {
      const current_index = initial_order.findIndex(
        (element) => element === user_id
      );
      const next_index = mod(current_index + direction, initial_order.length);
      const next_id = initial_order[next_index];
      return next_id;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Check whether the challenge made,and if challenge made, check whether the challenge is success;draw the penalty cards to the user based on the result of challenge.
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * Return a array if executes success: the 1st element is boolean value which indicated whether the current player do the challenge; the 2nd element is the user_id who drawed the penalty cards; the 3rd element is an array of the card id of penalty cards
 */
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
        let is_match = false;
        for (card_id of cards) {
          const card = CardFactory.create(card_id);
          if (card.type === "number") {
            if (
              card.color === matching.color ||
              card.face_value === matching.value
            ) {
              is_match = true;
              break;
            }
          } else if (card.type === "action") {
            if (
              card.color === matching.color ||
              card.action === matching.value
            ) {
              is_match = true;
              break;
            }
          } else {
            // wild card, continue
            continue;
          }
        }
        let penalty_cards = [];
        if (is_match) {
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

/**
 * Get the undone_action of a given game
 * @param {number} game_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
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

/**
 * Sepecial case when user say uno but pass instead of play the card. reset uno status as false.
 * @param {number} game_id
 * @param {number} user_id
 * @returns
 * Return true for successfully excute the action, otherwise will throw an error
 */
exports.resetUnoAtPass = async (game_id, user_id) => {
  try {
    const game_cards = await gameCardsDriver.getPlayerCards(game_id, user_id);
    if (game_cards && game_cards.length >= 2) {
      return this.resetUno(game_id, user_id);
    } else {
      // game_cards === 1 uno status valid
      return true;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Check whether the game is end (which the given player has 0 card in hand)
 * @param {number} game_id
 * @param {number} user_id
 * @param {number} card_id
 * @returns
 * Return true for successfully excute the action, otherwise will return false
 */
exports.checkEndGame = async (game_id, user_id) => {
  try {
    const game_card = await gameCardsDriver.getPlayerCards(game_id, user_id);
    if (game_card && game_card.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

/**
 * Return the end game results; draw_card_performer and drawed_cards are the next user who has to
 * finished the drawed card penalty side effect if the last card is wild draw four / draw two,
 * @param {number} game_id
 * @param {number} draw_card_performer
 * @param {number} drawed_cards
 * @returns
 * Return the end game results based on the given info
 */
exports.endGame = async (game_id, draw_card_performer, drawed_cards) => {
  const game_results = {};
  game_results.game_id = game_id;
  game_results.draw_card_performer = draw_card_performer;
  game_results.drawed_cards = drawed_cards;
  game_results.results = [];
  try {
    const game_users = await gameUsersDriver.getGameUsersByGameId(game_id);
    if (game_users && game_users.length === 0) {
      const error = new LogicalError(
        `Invalid data resource, ${game_id} is not existed in game_users table`,
        404
      );
      throw error;
    }
    for await (game_user of game_users) {
      const userObj = {};
      userObj.user_id = game_user.id;
      userObj.username = game_user.username;
      const game_cards = await gameCardsDriver.getPlayerCards(
        game_id,
        game_user.id
      );
      let points = 0;
      for (game_card of game_cards) {
        points += getPointOfCard(game_card.card_id);
      }
      userObj.points = points;
      game_results.results.push(userObj);
    }
    // sort points by cards ASC
    game_results.results.sort((a, b) => {
      return a.points - b.points;
    });
    // lowest points is winner, get all others points MINUS his/her own points
    // all others are losers, minus all their points
    for (let i = 0; i < game_results.results.length; ++i) {
      game_results.results[i].points = 0 - game_results.results[i].points;
      if (i === 0) {
        for (let j = 1; j < game_results.results.length; ++j) {
          game_results.results[i].points += game_results.results[j].points;
        }
      }
    }
    // set game_users points
    for await (user of game_results.results) {
      await gameUsersDriver.setPoints(game_id, user.user_id, user.points);
    }
    // set finished game time;
    await gamesDriver.setEndGame(game_id);
    return game_results;
  } catch (err) {
    throw err;
  }
};
