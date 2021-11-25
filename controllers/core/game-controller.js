const coreDriver = require("../../db/drivers/core-driver");

const gameListManager = require("../../volatile/gameListManager");

const CardFactory = require("../../factories/cardFactory");
const eventsGame = require("../../socket/eventsGame");

exports.joinGame = async (req, res, next) => {
  const username = req.session.userName;
  const game_id = +req.body.game_id;
  try {
    const user_list = await coreDriver.getGameUserList(game_id);
    if (user_list && user_list.length) {
      eventsGame.userJoin(game_id, username, user_list);
      res.status(200).render("game", { user_list: JSON.stringify(user_list) });
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
  const game_id = +req.body.game_id;

  try {
    const game_state = await coreDriver.getGameState(game_id, user_id);
    if (game_state) {
      res.status(200).json({
        status: "success",
        game_state: game_state,
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
  const game_id = +req.body.game_id;
  const user_id = req.session.userId;

  console.log(game_id);
  try {
    const card_id = await coreDriver.drawCard(game_id, user_id);
    const game_user_list = await coreDriver.getGameUserList(game_id);
    const set_undone_draw = await coreDriver.setUndoneActionDraw(game_id);
    if (card_id && game_user_list && set_undone_draw) {
      await eventsGame.drawCard(game_user_list, card_id, user_id);
      return res.status(200).json({
        status: "success",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

exports.pass = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user_id = req.session.userId;
  try {
    // Set undone none
    const reset_undone = await coreDriver.resetUndoneAction(game_id);
    // Set new current player
    const updated_current_play = await coreDriver.setNextCurrent(
      game_id,
      user_id,
      "next"
    );
    const game_user_list = await coreDriver.getGameUserList(game_id);

    if (reset_undone && updated_current_play && game_user_list) {
      eventsGame.pass(game_user_list, user_id);
      res.status(200).json({
        status: "success",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

exports.challenge = (req, res, next) => {
  const { color } = req.body;
  const game_id = +req.body.game_id;
  const user_id = req.session.userId;
  const is_challenge = req.body.is_challenge; // Boolean status as whether to do the challenge
  try {
    if (is_challenge === true) {
      // TODO challenge
      // is chanllenge success
      // last player contain the matching the color
    } else {
      //TODO not challenge
      // get 4 penalty cards
      // event
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

exports.sayUno = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user_id = req.session.userId;
  try {
    const isSetUnoSuccess = await coreDriver.setUno(game_id, user_id);
    if (isSetUnoSuccess) {
      // TODO events
      res.status(200).json({ status: "success" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

exports.playCard = async (req, res, next) => {
  const { undone_action } = req.body;
  const game_id = +req.body.game_id;
  const card_id = +req.body.card_id;
  const user_id = req.session.userId;
  const card = CardFactory.create(card_id);

  try {
    const game_user_list = await coreDriver.getGameUserList(game_id);
    await coreDriver.discard(game_id, card_id);
    if (undone_action === "draw") {
      await coreDriver.resetUndoneAction(game_id);
    }
    if (card.type === "number") {
      const matching_color = card.color;
      const matching_value = card.face_value;
      const isSetMatchingSuccess = await coreDriver.setMatching(
        game_id,
        matching_color,
        matching_value
      );
      const isSetCurrentSuccess = await coreDriver.setNextCurrent(
        game_id,
        user_id,
        "next"
      );
      if (isSetMatchingSuccess && isSetCurrentSuccess) {
        eventsGame.playCard(game_user_list, card_id, user_id, {
          action: "none",
        });
      }
    } else if (card.type === "action") {
      // change matching number (none)
      const matching_color = card.color;
      const matching_value = card.action; // "none" for non-number card
      const isSetMatchingSuccess = await coreDriver.setMatching(
        game_id,
        matching_color,
        matching_value
      );
      if (card.action === "reverse") {
        const isChangeDirectionSuccess = await coreDriver.changeDirection(
          game_id
        );
        const isSetCurrentSuccess = await coreDriver.setNextCurrent(
          game_id,
          user_id,
          "next"
        );
        if (
          isSetMatchingSuccess &&
          isChangeDirectionSuccess &&
          isSetCurrentSuccess
        ) {
          eventsGame.playCard(game_user_list, card_id, user_id, {
            action: "reverse",
          });
        }
      } else if (card.action === "skip") {
        const isSetCurrentSuccess = await coreDriver.setNextCurrent(
          game_id,
          user_id,
          "skip"
        );
        if (isSetMatchingSuccess && isSetCurrentSuccess) {
          eventsGame.playCard(game_user_list, card_id, user_id, {
            action: "skip",
          });
        }
      } else {
        // draw two
        const [draw_card_id_list, performer] = await coreDriver.nextDrawTwo(
          game_id,
          user_id
        );
        const isSetCurrentSuccess = await coreDriver.setNextCurrent(
          game_id,
          user_id,
          "skip"
        );
        if (draw_card_id_list && isSetCurrentSuccess) {
          eventsGame.playCard(game_user_list, card_id, user_id, {
            action: "draw_two",
            performer: performer,
            cards: draw_card_id_list,
          });
        }
      }
    } else {
      const matching_color = req.body.color;
      const isSetCurrentSuccess = await coreDriver.setNextCurrent(
        game_id,
        user_id,
        "next"
      );
      if (card.action === "wild") {
        const matching_value = card.face_value; // actually value "none"
        const isSetMatchingSuccess = await coreDriver.setMatching(
          game_id,
          matching_color,
          matching_value
        );
        eventsGame.playCard(game_user_list, card_id, user_id, {
          action: "wild",
          color: matching_color,
        });
      } else {
        // TODO set game.undone action = "matching color" for challenge
        eventsGame.playCard(game_user_list, card_id, user_id, {
          action: "wild_draw_four",
          color: matching_color,
        });
      }
    }
    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
