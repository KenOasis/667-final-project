const gameListManager = require("../../volatile/gameListManager");
const gameUsersDriver = require("../../db/drivers/game-users-driver");
const cardsDriver = require("../../db/drivers/card-drivers");
const gameCardsDriver = require("../../db/drivers/game-cards-driver");
const gamesDriver = require("../../db/drivers/games-driver");

const eventsLobby = require("../../socket/eventsLobby");

const shuffle = require("../../util/shuffle");

exports.createGame = async (req, res, next) => {
  const game_name = req.body.game_name;

  const user = {
    user_id: req.session.userId,
    username: req.session.userName,
  };

  try {
    const new_game = await gameListManager.createGame(game_name, user);
    eventsLobby.createGame(new_game);
    res.status(200).json({
      status: "success",
      message: "Game: " + game_name + " is created!",
    });
  } catch (err) {
    console.error(err);
  }
};

exports.joinGame = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId,
  };
  const game = gameListManager.joinGame(game_id, user);
  if (game) {
    eventsLobby.joinGame(game, user);
    // If game is full
    if (game.status === "full") {
      const users_id = gameListManager
        .getUserListOfGame(game_id)
        .map((user) => user.user_id);
      eventsLobby.initGame(game_id, users_id);

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
      } catch (err) {
        console.error(err);
        res
          .status(202)
          .json({ status: "failed", message: "Initial game failed" });
      }
    }
    res.status(200).json({
      status: "success",
      message: "You have joint the game " + game.name,
    });
  } else {
    res.status(409).json({
      status: "failed",
      message: "The game is full.",
    });
  }
};

exports.leaveGame = (req, res, next) => {
  const game_id = +req.body.game_id;
  const user = {
    username: req.session.userName,
    user_id: req.session.userId,
  };
  const [gameStatus, game] = gameListManager.leaveGame(game_id, user);

  eventsLobby.leaveGame(gameStatus, game, user);
  res.status(200).json({
    status: "success",
    message: "You have leave the game " + game.name,
  });
};

exports.getLobby = async (req, res, next) => {
  let isLoggedIn = req.session.isLoggedIn === true ? true : false;
  if (isLoggedIn) {
    const username = req.session.userName;
    const user_id = req.session.userId;
    const user = {
      username: username,
      user_id: user_id,
    };
    const userStatus = gameListManager.getUserStatus(user_id);
    eventsLobby.joinLobby(user, userStatus);
    return res.status(200).render("lobby", { whoami: username });
  } else {
    return res.status(401).render("login");
  }
};
