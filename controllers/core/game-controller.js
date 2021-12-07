const coreDriver = require("../../db/drivers/core-driver");

const CardFactory = require("../../factories/cardFactory");
const eventsGame = require("../../socket/eventsGame");

exports.joinGame = async (req, res, next) => {
  const username = req.session.userName;
  const game_id = +req.body.game_id;
  try {
    const is_active_game = await coreDriver.isActiveGame(game_id);
    console.log(is_active_game);
    if (!is_active_game) {
      return res.status(409).redirect("/lobby/");
    }
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
  console.log("draw");
  try {
    const is_action_valid = await coreDriver.checkActionValidation(
      game_id,
      user_id
    );
    if (!is_action_valid) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You action is forbidden",
      });
    }
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
    const is_action_valid = await coreDriver.checkActionValidation(
      game_id,
      user_id
    );
    if (!is_action_valid) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You action is forbidden",
      });
    }
    // Set undone none
    const reset_undone = await coreDriver.resetUndoneAction(game_id);

    // If user is under UNO status and click pass as two cards, reset uno status to false (rare condition)
    const reset_uno = await coreDriver.resetUnoAtPass(game_id, user_id);
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

exports.challenge = async (req, res, next) => {
  const game_id = +req.body.game_id;
  const user_id = req.session.userId;
  const is_challenge = req.body.is_challenge; // Boolean status as whether to do the challenge
  let is_success = false;
  let penalty_id;
  let penalty_cards;
  let is_set_current_success = true;
  try {
    const is_action_valid = await coreDriver.checkActionValidation(
      game_id,
      user_id
    );
    if (!is_action_valid) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You action is forbidden",
      });
    }
    const game_user_list = await coreDriver.getGameUserList(game_id);
    if (is_challenge === true) {
      // check challenge and do penalty based on the challenge result
      [is_success, penalty_id, penalty_cards] = await coreDriver.checkChallenge(
        game_id,
        user_id
      );
    } else {
      //do not challenge
      penalty_id = user_id;
      penalty_cards = await coreDriver.drawFour(game_id, user_id);
      is_set_current_success = await coreDriver.setNextCurrent(
        game_id,
        user_id,
        "next"
      );
    }
    if (is_success === false) {
      // if not success (or not challenge as default value false) skip his own round
      is_set_current_success = await coreDriver.setNextCurrent(
        game_id,
        user_id,
        "next"
      );
    }
    if (
      penalty_id &&
      penalty_cards &&
      is_set_current_success &&
      game_user_list &&
      game_user_list.length
    ) {
      const matching_color = await coreDriver.getUndoneAction(game_id);
      await coreDriver.setMatching(game_id, matching_color, "none");
      await coreDriver.resetUndoneAction(game_id);
      eventsGame.challenge(
        game_user_list,
        user_id,
        is_challenge,
        is_success,
        penalty_id,
        penalty_cards
      );
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
    const is_action_valid = await coreDriver.checkActionValidation(
      game_id,
      user_id
    );
    if (!is_action_valid) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You action is forbidden",
      });
    }
    const game_user_list = await coreDriver.getGameUserList(game_id);
    const isSetUnoSuccess = await coreDriver.setUno(game_id, user_id);
    if (game_user_list && isSetUnoSuccess) {
      eventsGame.sayUno(game_user_list, user_id);
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
    const is_action_valid = await coreDriver.checkActionValidation(
      game_id,
      user_id,
      card_id
    );
    if (!is_action_valid) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You action is forbidden",
      });
    }
    const game_user_list = await coreDriver.getGameUserList(game_id);
    await coreDriver.discard(game_id, card_id);
    // Check end game
    const isEndGame = await coreDriver.checkEndGame(game_id, user_id, card_id);
    if (isEndGame) {
      let drawed_cards = [];
      let draw_card_performer = user_id;
      console.log(card.action);
      if (card.action === "draw_two") {
        [drawed_cards, draw_card_performer] = await coreDriver.nextDrawTwo(
          game_id,
          user_id
        );
      } else if (card.action === "wild_draw_four") {
        draw_card_performer = await coreDriver.getNextPlayerId(
          game_id,
          user_id
        );
        drawed_cards = await coreDriver.drawFour(game_id, draw_card_performer);
      }
      const game_results = await coreDriver.endGame(
        game_id,
        draw_card_performer,
        drawed_cards
      );
      const game_state = await coreDriver.getGameState(game_id, user_id);
      console.log(game_state);
      console.log(game_results);
      eventsGame.endGame(game_results);
      res.status(200).json({
        status: "success",
        message: "Game over!",
      });
    } else {
      if (undone_action === "draw") {
        await coreDriver.resetUndoneAction(game_id);
      }
      if (card.type === "number") {
        const matching_color = card.color;
        const matching_value = card.face_value;
        const is_set_matching_success = await coreDriver.setMatching(
          game_id,
          matching_color,
          matching_value
        );
        const is_set_current_success = await coreDriver.setNextCurrent(
          game_id,
          user_id,
          "next"
        );
        if (is_set_matching_success && is_set_current_success) {
          eventsGame.playCard(game_user_list, card_id, user_id, {
            action: "none",
          });
        }
      } else if (card.type === "action") {
        const matching_color = card.color;
        const matching_value = card.action; // matching_value as type of action card
        const is_set_matching_success = await coreDriver.setMatching(
          game_id,
          matching_color,
          matching_value
        );
        if (card.action === "reverse") {
          const is_change_direction_success = await coreDriver.changeDirection(
            game_id
          );
          const is_set_current_success = await coreDriver.setNextCurrent(
            game_id,
            user_id,
            "next"
          );
          if (
            is_set_matching_success &&
            is_change_direction_success &&
            is_set_current_success
          ) {
            eventsGame.playCard(game_user_list, card_id, user_id, {
              action: "reverse",
            });
          }
        } else if (card.action === "skip") {
          const [is_set_current_success, performer] =
            await coreDriver.setNextCurrent(game_id, user_id, "skip");
          if (is_set_matching_success && is_set_current_success) {
            eventsGame.playCard(game_user_list, card_id, user_id, {
              action: "skip",
              performer: performer,
            });
          }
        } else {
          // draw two
          const [draw_card_id_list, performer] = await coreDriver.nextDrawTwo(
            game_id,
            user_id
          );
          const is_set_current_success = await coreDriver.setNextCurrent(
            game_id,
            user_id,
            "skip"
          );
          if (draw_card_id_list && is_set_current_success) {
            eventsGame.playCard(game_user_list, card_id, user_id, {
              action: "draw_two",
              performer: performer,
              cards: draw_card_id_list,
            });
          }
        }
      } else {
        const is_set_current_success = await coreDriver.setNextCurrent(
          game_id,
          user_id,
          "next"
        );
        if (card.action === "wild") {
          const matching_color = req.body.color;
          const matching_value = card.face_value; // actually value "none"
          const is_set_matching_success = await coreDriver.setMatching(
            game_id,
            matching_color,
            matching_value
          );
          eventsGame.playCard(game_user_list, card_id, user_id, {
            action: "wild",
            color: matching_color,
          });
        } else {
          const color = req.body.color;
          coreDriver.setUndoneActionWildDrawFourColor(game_id, color);
          eventsGame.playCard(game_user_list, card_id, user_id, {
            action: "wild_draw_four",
            color: color,
          });
        }
      }
      return res.status(200).json({ status: "success" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
};
