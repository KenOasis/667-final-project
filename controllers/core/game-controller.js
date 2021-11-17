const gameUsersDriver = require("../../db/drivers/game-users-driver");
const cardsDriver = require("../../db/drivers/card-drivers");
const gameCardsDriver = require("../../db/drivers/game-cards-driver");
const gamesDriver = require("../../db/drivers/games-driver");

const shuffle = require("../../util/shuffle");

const gameStateDummy = require("../../volatile/gameStateDummy");
const gameListManager = require("../../volatile/gameListManager");

const eventsLobby = require("../../socket/eventsLobby");

exports.startGame = async (req, res, next) => {
  const user_id = req.session.userId;
  const { game_id } = req.body;

  try {
    const isInGame = await gameUsersDriver.checkUserInGame(game_id, user_id);

    if (isInGame) {
      const card_deck = await gameCardsDriver.getCardDeck(game_id);
      console.log(card_deck);

      const game_direction = await gamesDriver.getDirection(game_id);
      console.log(game_direction);

      const game_order = await gameUsersDriver.getGameOrder(game_id);
      console.log(game_order);

      const current_player = await gameUsersDriver.getCurrentPlayer(game_id);
      console.log(current_player);

      const matching = await gamesDriver.getMatching(game_id);
      console.log(matching);

      const players = await gameCardsDriver.getPlayers(game_id, user_id);
      console.log(players);

      const discards = await gameCardsDriver.getDiscards(game_id);
      console.log(discards);
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
          reciever: 0,
          card_deck,
          game_direction,
          game_order,
          current_player,
          matching,
          players,
          discards,
        };

        // TODO this should be send as parameter when rendering the game page
        res.status(200).json({
          status: "success",
          game_state: game_state,
        });
      } else {
        res.status(500).json({
          status: "failed",
          message: "Internal error, pls contact admin",
        });
      }
    } else {
      res.status(403).json({
        status: "forbidden",
        message: "Join game failed. You are not in this game",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Joined game failed.",
    });
  }
};

exports.drawCard = (req, res, next) => {
  const game_id = req.body.game_id;
  const users_id = req.body.user_id;
};
exports.playCard = (req, res, next) => {
  const game_id = req.body.game_id;
  const user_id = req.body.user_id;
  const card_id = req.body.card_id;
  const wild_color = req.body.wild_status; // if the card is wild card, the current player need to select a color
  // TODO according the card's action_type to trigger futher action
};

exports.challenge = (req, res, next) => {
  const game_id = req.body.game_id;
  const user_id = req.body.user_id;
  const challenge = req.body.challenge; // Boolean status as whether to do the challenge
  const wild_color = req.body.card_id; // The color picked by the user to do the challenge (if they try to do the challenge)
  // TODO updated the game state as the result of the challenge
};

exports.sayUno = (req, res, next) => {};

exports.generateGameState = (req, res, next) => {
  const game_state = gameStateDummy.getGameState();
  res.status(200).json({
    game_state: game_state,
  });
};
exports.getGame = (req, res, next) => {
  return res.status(200).render("game");
};

exports.playCard = (req, res, next) => {
  return res.status(200).json({});
};
