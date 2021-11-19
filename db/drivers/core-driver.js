const cardsDriver = require("./cards-driver");
const gameCardsDriver = require("./game-cards-driver");
const gameUsersDriver = require("./game-users-driver");
const gamesDriver = require("./games-driver");

const shuffle = require("../../util/shuffle");

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
    if (
      card_deck &&
      game_direction &&
      game_order &&
      current_player &&
      matching &&
      players &&
      discards
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
    const isActionSuccess = await gameCardsDriver.draw_card(game_id, user_id);
    return isActionSuccess;
  } catch (err) {
    console.error(err);
    throw new Error("DB error.");
  }
};
