const coreDriver = require("../../db/drivers/core-driver");

const gameStateDummy = require("../../volatile/gameStateDummy");
const gameListManager = require("../../volatile/gameListManager");

const eventsGame = require("../../socket/eventsGame");

exports.joinGame = async (req, res, next) => {
  const user_id = req.session.userId;
  const { game_id } = req.body;
  try {
    const isInGame = await coreDriver.checkUserInGame(game_id, user_id);
    if (isInGame) {
      const user_list = await coreDriver.getGameUserList(game_id);
      console.log(user_list);
      if (user_list && user_list.length) {
        eventsGame.userJoin(game_id);
        res
          .status(200)
          .render("game", { user_list: JSON.stringify(user_list) });
      } else {
        throw new Error("fetch users list failed");
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

exports.loadGameState = async (req, res, next) => {
  const user_id = req.session.userId;
  const { game_id } = req.body;

  try {
    const isInGame = await coreDriver.checkUserInGame(game_id, user_id);
    if (isInGame) {
      const game_state = await coreDriver.getGameState(game_id, user_id);
      if (game_state) {
        res.status(200).json({
          status: "success",
          game_state: game_state,
        });
      } else {
        throw new Error("DB error.");
      }
      // TODO this should be send as parameter when rendering the game page
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

exports.drawCard = async (req, res, next) => {
  const { game_id } = req.body;
  const user_id = req.session.userId;

  try {
    const isInGame = await coreDriver.checkUserInGame(game_id, user_id);
    if (isInGame) {
      const isActionSuccess = await coreDriver.drawCard(game_id, user_id);
      if (isActionSuccess) {
        // TODO brocast the game_state and update object to all users in this game
      } else {
        throw new Error("DB error");
      }
    } else {
      res.status(403).json({
        status: "forbidden",
        message: "Request failed: You are not in this game",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "forbidden",
      message: "Internal server error",
    });
  }
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
  //  PSEUDOCODE FOR PLAYING A CARD

  //  1) get card info from card that was played
  //  const card_id = req.body.card_id
  //  const card = await Cards.getCard(card_id)

  //  2) get card info from card that is on top of the discard pile (get top card from discard pile)
  //    should we have a discard_order in addition to draw_order for the game_card ???
  //  const top_card_from_pile = GameCards.getCard(
  //    where: {game_id: game_id, discarded: true},
  //    order: ['discard_order': DESC] (order so that the last played card is selected)
  //    limit: 1
  //  )

  //  3) if played card is no action card: check if played card is valid
  //  if (card.action == no_action && card.color == top_card_from_pile.color && card.face_value > top_card_from_pile.face_value) {
  //    //add card to the discard pile: set discarded == true && discard_order to top_card_from_pile.discard_order + 1
  //    advance to next player turn
  //    return
  //  } else {
  //    //respond with error
  //    res.status(400)
  //    return
  //  }

  //  4) if card is an action card and color matches: execute the action
  //  if (card.action != no_action && card.color == top_card_from_pile.color) {
  //    if (card.action == skip) {
  //      // advance to next player turn
  //    } else if (card.action == reverse) {
  //      // change game direction and advance to next player turn (now in other order)
  //    } else if (card.action == draw_two) {
  //      // draw two cards for the next player
  //    } else if (card.action == wild) {
  //      // TODO: set a new color
  //    } else if (card.action == wild_draw_four) {
  //      // TODO: challenge? -> otherwise set new color & draw 4 cards for next player
  //    }
  //  } else {
  //    //respond with error
  //    res.status(400)
  //  }

  return res.status(200).json({});
};
