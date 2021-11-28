const host = "http://" + location.host + "/game";
const socket = io(host, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
  upgrade: false,
});

// socket.on("connect", () => {
//   console.log(socket.connected); // true
// });

socket.on("userJoin", (data) => {
  const username = data.username;
  console.log(username + " Join the game");
});

socket.on("gameStart", (data) => {
  loadGameState();
});

socket.on("userDisconnect", (data) => {
  const username = data.username;
  console.log(username + " disconnected");
});

socket.on("gameUpdateDrawCard", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Draw");
  const performer = update.actions[0].performer;
  const add_card = update.actions[0].card;
  const game_class = new game_state_helper(game_state);
  if (performer === player_controller.whoami()) {
    action_util
      .add_card_event(add_card)
      .then((result) => {
        if (result === "done") {
          game_class.refresh_hand_card(performer);
          game_class.set_card_click_event();
          game_class.set_current_player();
          game_class.color_match_card();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const player = document.getElementById("player_" + performer.toString());
    const position = player.getAttribute("position");
    if (position === "left" || position === "right") {
      action_util.add_card_back_event(1, "cardcol", performer);
    } else {
      action_util.add_card_back_event(1, "back", performer);
    }
  }
  game_class.set_deck();
});

socket.on("gameUpdatePass", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Pass!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
});

socket.on("gameUpdatePlayCard", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("PlayCard!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
});

socket.on("gameUpdateReverse", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("Reverse!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
});

socket.on("gameUpdateSkip", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("Skip!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
});

socket.on("gameUpdateDrawTwo", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Draw_two!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const draw_card_player = update.actions.filter((obj) => {
    if (obj.type == "draw_two") {
      return obj;
    }
  });
  const play_card_player = update.actions.filter((obj) => {
    if (obj.type == "play_card") {
      return obj;
    }
  });
  const play_card_performer = play_card_player[0].performer;
  const game_class = new game_state_helper(game_state);
  const performer = draw_card_player[0].performer;
  if (performer === game_state.receiver) {
    const add_card = draw_card_player[0].cards;
    action_util
      .add_card_event(add_card)
      .then((result) => {
        if (result === "done") {
          game_class.refresh_hand_card(performer);
          game_class.color_match_card();
          game_class.set_side_stuff();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    if (game_state.receiver == play_card_performer) {
      game_class.refresh_hand_card(play_card_performer);
      game_class.color_match_card();
    }
    if (game_class.check_current_is_receiver()) {
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    const player = document.getElementById("player_" + performer.toString());

    const position = player.getAttribute("position");

    if (position === "left" || position === "right") {
      action_util.add_card_back_event(2, "cardcol", performer);
    } else {
      action_util.add_card_back_event(2, "back", performer);
    }
  }
  game_class.set_current_player();
  game_class.set_side_stuff();
  game_class.set_deck();
});

socket.on("gameUpdateWild", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("Wild!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
});

socket.on("gameUpdateWildDrawFour", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Wild Draw Four!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const play_card_player = update.actions.filter((obj) => {
    if (obj.type == "play_card") {
      return obj;
    }
  });
  const play_card_user = play_card_player[0].performer;
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == play_card_user) {
    game_class.refresh_hand_card(play_card_user);
  }
  game_class.delete_click_event();
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
});

socket.on("sayUnoUpdate", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Uno!");
  console.log(game_state);
  console.log(update);
  /**
   * like Draw
   *  base on game_state to update uno state
   *  when uno == true{
   *   color img
   *  }
   *  else{
   *    back_white img
   *  }
   *  show uno action in page
   *
   */
});

socket.on("notChallengeUpdate", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Does not challenge!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  const penalty_player = update.actions[0].penalty_player;
  if (game_state.receiver === penalty_player) {
    const card_list = update.actions[0].penalty_cards;
    action_util
      .add_card_event(card_list)
      .then((result) => {
        if (result === "done") {
          game_class.refresh_hand_card(penalty_player);
          game_class.color_match_card();
          game_class.set_side_stuff();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const cards_num = update.actions[0].penalty_count;
    if (game_class.check_current_is_receiver()) {
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    const player = document.getElementById(
      "player_" + penalty_player.toString()
    );

    const position = player.getAttribute("position");

    if (position === "left" || position === "right") {
      action_util.add_card_back_event(cards_num, "cardcol", penalty_player);
    } else {
      action_util.add_card_back_event(cards_num, "back", penalty_player);
    }
    game_class.set_side_stuff();
  }

  game_class.set_current_player();
  game_class.set_deck();
});

socket.on("challengeSuccessUpdate", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Challenge success!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  const penalty_player = update.actions[0].penalty_player;
  if (game_state.receiver === penalty_player) {
    const card_list = update.actions[0].penalty_cards;
    action_util
      .add_card_event(card_list)
      .then((result) => {
        if (result === "done") {
          game_class.refresh_hand_card(penalty_player);
          game_class.color_match_card();
          game_class.set_side_stuff();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const cards_num = update.actions[0].penalty_count;
    if (game_class.check_current_is_receiver()) {
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    const player = document.getElementById(
      "player_" + penalty_player.toString()
    );

    const position = player.getAttribute("position");

    if (position === "left" || position === "right") {
      action_util.add_card_back_event(cards_num, "cardcol", penalty_player);
    } else {
      action_util.add_card_back_event(cards_num, "back", penalty_player);
    }
    game_class.set_side_stuff();
  }

  game_class.set_current_player();
  game_class.set_deck();
});

socket.on("challengeFailUpdate", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("challenge fail!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  const penalty_player = update.actions[0].penalty_player;
  if (game_state.receiver === penalty_player) {
    const card_list = update.actions[0].penalty_cards;
    action_util
      .add_card_event(card_list)
      .then((result) => {
        if (result === "done") {
          game_class.refresh_hand_card(penalty_player);
          game_class.color_match_card();
          game_class.set_side_stuff();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const cards_num = update.actions[0].penalty_count;
    if (game_class.check_current_is_receiver()) {
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    const player = document.getElementById(
      "player_" + penalty_player.toString()
    );

    const position = player.getAttribute("position");

    if (position === "left" || position === "right") {
      action_util.add_card_back_event(cards_num, "cardcol", penalty_player);
    } else {
      action_util.add_card_back_event(cards_num, "back", penalty_player);
    }
    game_class.set_side_stuff();
  }

  game_class.set_current_player();
  game_class.set_deck();
});

/**
 * final counting
 *
 *
 *
 *
 *
 */
