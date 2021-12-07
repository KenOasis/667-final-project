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
  const timestamp = data.timestamp;
  const obj = {
    username,
    status: "connected",
    timestamp,
  };
  updateChat(obj, "connection");
});

socket.on("gameStart", (data) => {
  loadGameState();
});

socket.on("userDisconnect", (data) => {
  const username = data.username;
  const timestamp = data.timestamp;
  const obj = {
    username,
    status: "disconnected",
    timestamp,
  };
  updateChat(obj, "connection");
});

socket.on("gameUpdateDrawCard", (data) => {
  const game_state = data.game_state;
  const update = data.update;
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
    game_class.add_back_side_card(performer, 1);
  }
  game_class.set_deck();
  show_action_prompts(update);
});

socket.on("gameUpdatePass", (data) => {
  console.log("pass!");
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
  show_action_prompts(update);
});

socket.on("gameUpdatePlayCard", (data) => {
  console.log("play");
  const game_state = data.game_state;
  const update = data.update;
  console.log("PlayCard!");
  console.log(game_state);
  console.log(update);

  const game_update = new game_update_helper(update);
  const game_class = new game_state_helper(game_state);
  // game_class.action_empty_card();
  const play_card_obj = game_update.get_play_card_performer_obj();
  const performer = play_card_obj.performer;
  const check_penalty = game_update.check_card_penalty();
  page_effect.cancel_highlinght();
  if (game_state.receiver == performer) {
    if (check_penalty) {
      const remove_card = play_card_obj.card[0];
      const uno_caller = game_update.get_uno_penalty_player_obj()[0];
      action_util.remove_one_card(remove_card);
      const penanlty_cards = uno_caller.cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
            game_class.delete_click_event();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      game_class.refresh_hand_card(performer);
      game_class.delete_click_event();
    }
  } else {
    if (game_class.check_current_is_receiver()) {
      // game_class.action_empty_card();
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    game_class.show_back_card_again(performer);
  }
  game_class.set_current_player();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("gameUpdateReverse", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  new Audio("/audio/reverse.m4a").play();
  console.log("Reverse!");
  console.log(game_state);
  console.log(update);
  const game_update = new game_update_helper(update);
  const game_class = new game_state_helper(game_state);
  const play_card_obj = game_update.get_play_card_performer_obj();
  const performer = play_card_obj.performer;
  const check_penalty = game_update.check_card_penalty();
  page_effect.cancel_highlinght();
  if (game_state.receiver == performer) {
    if (check_penalty) {
      const remove_card = play_card_obj.card[0];
      const uno_caller = game_update.get_uno_penalty_player_obj()[0];
      action_util.remove_one_card(remove_card);
      const penanlty_cards = uno_caller.cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
            game_class.delete_click_event();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      game_class.refresh_hand_card(performer);
      game_class.delete_click_event();
    }
  } else {
    if (game_class.check_current_is_receiver()) {
      // game_class.action_empty_card();
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card;
    }
    game_class.show_back_card_again(performer);
  }
  game_class.set_current_player();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("gameUpdateSkip", (data) => {
  console.log("skip!");
  new Audio("/audio/skip.m4a").play();
  const game_state = data.game_state;
  const update = data.update;
  console.log("Skip!");
  console.log(game_state);
  console.log(update);
  const game_update = new game_update_helper(update);
  const game_class = new game_state_helper(game_state);
  const play_card_obj = game_update.get_play_card_performer_obj();
  const performer = play_card_obj.performer;
  const check_penalty = game_update.check_card_penalty();
  page_effect.cancel_highlinght();
  if (game_state.receiver == performer) {
    if (check_penalty) {
      const remove_card = play_card_obj.card[0];
      const uno_caller = game_update.get_uno_penalty_player_obj()[0];
      action_util.remove_one_card(remove_card);
      const penanlty_cards = uno_caller.cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
            game_class.delete_click_event();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      game_class.refresh_hand_card(performer);
      game_class.delete_click_event();
    }
  } else {
    if (game_class.check_current_is_receiver()) {
      // game_class.action_empty_card();
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    game_class.show_back_card_again(performer);
  }
  game_class.set_current_player();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("gameUpdateDrawTwo", (data) => {
  console.log("draw two!");
  new Audio("/audio/draw_two.m4a").play();
  const game_state = data.game_state;
  const update = data.update;
  console.log("Draw_two!");
  console.log(game_state);
  console.log(update);
  const game_update = new game_update_helper(update);
  const game_class = new game_state_helper(game_state);
  page_effect.cancel_highlinght();
  const draw_card_player = game_update.get_draw_two_card_performer_obj();
  const play_card_player = game_update.get_play_card_performer_obj();
  const play_card_performer = play_card_player.performer;
  const check_penalty = game_update.check_card_penalty();
  const draw_card_performer = draw_card_player.performer;
  if (check_penalty) {
    const uno_caller_obj = game_update.get_uno_penalty_player_obj()[0];
    const uno_caller = uno_caller_obj.performer;
    if (game_state.receiver === uno_caller) {
      const remove_card = play_card_player.card[0];
      action_util.remove_one_card(remove_card);
      const penanlty_cards = uno_caller_obj.cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(play_card_performer);
            game_class.color_match_card();
            game_class.delete_click_event();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      game_class.show_back_card_again(uno_caller);
    }
  } else {
    if (game_state.receiver === play_card_performer) {
      game_class.refresh_hand_card(play_card_performer);
      game_class.color_match_card(play_card_performer);
      game_class.delete_click_event();
    } else {
      game_class.show_back_card_again(play_card_performer);
    }
  }
  if (draw_card_performer === game_state.receiver) {
    const add_card = draw_card_player.cards;
    action_util
      .add_card_event(add_card)
      .then((result) => {
        if (result === "done") {
          game_class.refresh_hand_card(draw_card_performer);
          game_class.color_match_card();
          game_class.set_side_stuff();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    if (game_class.check_current_is_receiver()) {
      // game_class.action_empty_card();
      game_class.color_match_card();
      game_class.set_card_click_event();
    } else if (game_state.receiver != play_card_performer) {
      game_class.delete_click_event();
      game_class.color_match_card();
    }
    game_class.add_back_side_card(draw_card_performer, 2);
  }
  game_class.set_current_player();
  game_class.set_side_stuff();
  game_class.set_deck();
  show_action_prompts(update);
});

socket.on("gameUpdateWild", (data) => {
  console.log("wild!");
  new Audio("/audio/wild.m4a").play();
  const game_state = data.game_state;
  const update = data.update;
  console.log("Wild!");
  console.log(game_state);
  console.log(update);
  const game_update = new game_update_helper(update);
  const game_class = new game_state_helper(game_state);
  const play_card_obj = game_update.get_play_card_performer_obj();
  const performer = play_card_obj.performer;
  const check_penalty = game_update.check_card_penalty();
  page_effect.cancel_highlinght();
  if (game_state.receiver == performer) {
    if (check_penalty) {
      const remove_card = play_card_obj.card[0];
      const uno_caller = game_update.get_uno_penalty_player_obj()[0];
      console.log(uno_caller);
      action_util.remove_one_card(remove_card);
      const penanlty_cards = uno_caller.cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
            game_class.delete_click_event();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      game_class.refresh_hand_card(performer);
      game_class.delete_click_event();
    }
  } else {
    if (game_class.check_current_is_receiver()) {
      // game_class.action_empty_card();
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card;
    }
    game_class.show_back_card_again(performer);
  }
  game_class.set_current_player();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("gameUpdateWildDrawFour", (data) => {
  console.log("draw_four!");
  new Audio("/audio/wild_draw_four.m4a").play();

  const game_state = data.game_state;
  const update = data.update;
  console.log("Wild Draw Four!");
  console.log(game_state);
  console.log(update);
  const game_update = new game_update_helper(update);
  const game_class = new game_state_helper(game_state);
  const play_card_obj = game_update.get_play_card_performer_obj();
  const performer = play_card_obj.performer;
  const check_penalty = game_update.check_card_penalty();
  page_effect.cancel_highlinght();
  if (game_state.receiver == performer) {
    if (check_penalty) {
      const remove_card = play_card_obj.card[0];
      const uno_caller = game_update.get_uno_penalty_player_obj()[0];
      action_util.remove_one_card(remove_card);
      const penanlty_cards = uno_caller.cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
            game_class.delete_click_event();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      game_class.refresh_hand_card(performer);
      game_class.delete_click_event();
    }
  } else {
    if (game_class.check_current_is_receiver()) {
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card;
    }
    game_class.show_back_card_again(performer);
  }

  game_class.set_current_player();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("sayUnoUpdate", (data) => {
  const game_state = data.game_state;
  new Audio("/audio/uno.m4a").play();
  const update = data.update;
  console.log("Uno!");
  console.log(game_state);
  console.log(update);
  const game_class = new game_state_helper(game_state);
  game_class.set_current_player();
  game_class.set_side_stuff();
  game_class.set_deck();
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
          // game_class.action_empty_card();
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
    game_class.add_back_side_card(penalty_player, cards_num);
    game_class.set_side_stuff();
  }
  show_action_prompts(update);
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
    game_class.add_back_side_card(penalty_player, cards_num);
    game_class.set_side_stuff();
  }

  game_class.set_current_player();
  game_class.set_deck();
  show_action_prompts(update);
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
    game_class.add_back_side_card(penalty_player, cards_num);
    game_class.set_side_stuff();
  }

  game_class.set_current_player();
  game_class.set_deck();
  show_action_prompts(update);
});

socket.on("endGameUpdate", (data) => {
  const game_state = data.game_state;
  const results = data.results;
  console.log("Game Over!");
  console.log(results);
  console.log(game_state);
  const winner = results.results[0].username;
  action_util.add_pointing_modal_title(winner);
  action_util.add_pointing_modal_body(results.results);
  const end_point_modal = document.getElementById("PointingModal");
  const mymodal = new bootstrap.Modal(end_point_modal);
  const game_class = new game_state_helper(game_state);
  const draw_card_performer = results.draw_card_performer;
  if (game_class.check_current_is_receiver()) {
    game_class.refresh_hand_card(game_state.current_player);
    if (draw_card_performer != game_state.current_player) {
      game_class.show_back_card_again(draw_card_performer);
    }
    mymodal.toggle();
  } else {
    if (draw_card_performer === game_state.receiver) {
      game_class.refresh_hand_card(game_state.receiver);
    } else {
      game_class.show_back_card_again(draw_card_performer);
    }
    game_class.show_back_card_again(game_state.current_player);
    mymodal.toggle();
  }
  game_class.set_side_stuff();
});

socket.on("chat", (data) => {
  updateChat(data, "message");
});
