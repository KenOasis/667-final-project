const cardsDriver = require("./cards-driver");
const gameCardsDriver = require("./game-cards-driver");
const gameUsersDriver = require("./game-users-driver");
const gamesDriver = require("./games-driver");

const shuffle = require("../../util/shuffle");
const init = require("connect-session-sequelize");

exports.checkUserInGame = async (game_id, user_id) => {
  try {
    const isInGame = await gameUsersDriver.checkUserInGame(game_id, user_id);

    if (isInGame !== null) {
      return isInGame;
    } else {
      throw new Error("DB error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error("DB error.");
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
    console.error(err);
    return false;
  }
};

exports.getGameUserList = async (game_id) => {
  try {
    const game_users_list = await gameUsersDriver.getGameUsersByGameId(game_id);
    let user_list = [];
    if (game_users_list) {
      user_list = game_users_list.map((game_users) => {
        return {
          game_id: game_id,
          user_id: game_users.id,
          username: game_users.username,
        };
      });
      return user_list;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
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
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

exports.drawCard = async (game_id, user_id) => {
  try {
    const card_id = await gameCardsDriver.draw_card(game_id, user_id);
    if (card_id) {
      return card_id;
    } else {
      throw new Error("DB error.");
    }
  } catch (err) {
    console.error(err);
    throw new Error("DB error.");
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
    console.error(err);
    return null;
  }
};

exports.setUndoneActionChallenge = async (game_id) => {
  try {
    const undone_action = "challenge";
    const updatedResult = await gamesDriver.updateUndoneAction(
      game_id,
      undone_action
    );
    return updatedResult;
  } catch (err) {
    console.error(err);
    return null;
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
    console.error(err);
    return null;
  }
};

exports.setNextCurrent = async (game_id, user_id, action) => {
  // action type: "next" = move 1, "skip" = move 2
  const step = action === "next" ? 1 : 2;
  try {
    const direction = await gamesDriver.getDirection(game_id);
    const initial_order = await gameUsersDriver.getGameOrder(game_id);
    const mod = (n, m) => ((n % m) + m) % m; // js modulo has bug when n is negative
    if (direction && initial_order) {
      const current_index = initial_order.findIndex(
        (element) => element === user_id
      );
      const new_index = mod(
        current_index + direction * step,
        initial_order.length
      );
      const current_player_id = initial_order[current_index];
      const new_current_player_id = initial_order[new_index];
      await gameUsersDriver.setCurrentPlayer(game_id, current_player_id, false);
      await gameUsersDriver.setCurrentPlayer(
        game_id,
        new_current_player_id,
        true
      );
      return true;
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
