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
  // console.log("Draw");
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
    const position = game_class.find_position(performer);
    const number_card = game_class.check_number_of_card(performer);
    if (number_card >= 10) {
      game_class.show_back_card_again(performer);
    } else {
      if (position === "left" || position === "right") {
        action_util.add_card_back_event(1, "cardcol", performer);
      } else {
        action_util.add_card_back_event(1, "back", performer);
      }
    }
  }
  game_class.set_deck();
  show_action_prompts(update);
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
  show_action_prompts(update);
});

socket.on("gameUpdatePlayCard", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("PlayCard!");
  console.log(game_state);
  console.log(update);
  let uno_caller = -1;
  const uno_caller_obj = update.actions.filter((action) => {
    if (action.type === "uno_penalty") {
      uno_caller = action.performer;
      return action;
    }
  });
  const check_uno = performer === uno_caller;
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
    if (check_uno) {
      const penanlty_cards = uno_caller_obj[0].cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    game_class.show_back_card_again(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("gameUpdateReverse", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("Reverse!");
  console.log(game_state);
  console.log(update);
  let uno_caller = -1;
  const uno_caller_obj = update.actions.filter((action) => {
    if (action.type === "uno_penalty") {
      uno_caller = action.performer;
      return action;
    }
  });
  const check_uno = performer === uno_caller;
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
    if (check_uno) {
      const penanlty_cards = uno_caller_obj[0].cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    game_class.show_back_card_again(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("gameUpdateSkip", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("Skip!");
  console.log(game_state);
  console.log(update);
  let uno_caller = -1;
  const uno_caller_obj = update.actions.filter((action) => {
    if (action.type === "uno_penalty") {
      uno_caller = action.performer;
      return action;
    }
  });
  const check_uno = performer === uno_caller;
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
    if (check_uno) {
      const penanlty_cards = uno_caller_obj[0].cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    game_class.show_back_card_again(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
  show_action_prompts(update);
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
  let uno_caller = -1;
  const uno_caller_obj = update.actions.filter((action) => {
    if (action.type === "uno_penalty") {
      uno_caller = action.performer;
      return action;
    }
  });
  const play_card_performer = play_card_player[0].performer;
  const check_uno = play_card_performer === uno_caller;
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
      if (check_uno) {
        const penanlty_cards = uno_caller_obj[0].cards;
        action_util
          .add_card_event(penanlty_cards)
          .then((result) => {
            if (result === "done") {
              game_class.refresh_hand_card(performer);
              game_class.color_match_card();
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // check play_card_performer have 0 card
    } else {
      game_class.show_back_card_again(play_card_performer);
    }
    if (game_class.check_current_is_receiver()) {
      game_class.set_card_click_event();
      game_class.color_match_card();
    } else {
      game_class.delete_click_event();
      game_class.color_match_card();
    }

    const position = game_class.find_position(performer);

    const number_card = game_class.check_number_of_card(performer);
    if (number_card >= 10) {
      game_class.show_back_card_again(performer);
    } else {
      if (position === "left" || position === "right") {
        action_util.add_card_back_event(2, "cardcol", performer);
      } else {
        action_util.add_card_back_event(2, "back", performer);
      }
    }
  }

  game_class.set_current_player();
  game_class.set_side_stuff();
  game_class.set_deck();
  show_action_prompts(update);
});

socket.on("gameUpdateWild", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  const performer = update.actions[0].performer;
  console.log("Wild!");
  console.log(game_state);
  console.log(update);
  let uno_caller = -1;
  const uno_caller_obj = update.actions.filter((action) => {
    if (action.type === "uno_penalty") {
      uno_caller = action.performer;
      return action;
    }
  });
  const check_uno = performer === uno_caller;
  page_effect.cancel_highlinght();
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == performer) {
    game_class.refresh_hand_card(performer);
    if (check_uno) {
      const penanlty_cards = uno_caller_obj[0].cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    game_class.show_back_card_again(performer);
  }
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event();
  } else {
    game_class.delete_click_event();
  }
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
  show_action_prompts(update);
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
  let uno_caller = -1;
  const uno_caller_obj = update.actions.filter((action) => {
    if (action.type === "uno_penalty") {
      uno_caller = action.performer;
      return action;
    }
  });
  const check_uno = play_card_user === uno_caller;
  const game_class = new game_state_helper(game_state);
  if (game_state.receiver == play_card_user) {
    game_class.refresh_hand_card(play_card_user);
    if (check_uno) {
      const penanlty_cards = uno_caller_obj[0].cards;
      action_util
        .add_card_event(penanlty_cards)
        .then((result) => {
          if (result === "done") {
            game_class.refresh_hand_card(performer);
            game_class.color_match_card();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    game_class.show_back_card_again(play_card_user);
  }

  game_class.delete_click_event();
  game_class.set_current_player();
  game_class.color_match_card();
  game_class.set_side_stuff();
  show_action_prompts(update);
});

socket.on("sayUnoUpdate", (data) => {
  const game_state = data.game_state;
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

    const position = game_class.find_position(penalty_player);
    const number_card = game_class.check_number_of_card(penalty_player);
    if (number_card >= 10) {
      game_class.show_back_card_again(penalty_player);
    } else {
      if (position === "left" || position === "right") {
        action_util.add_card_back_event(cards_num, "cardcol", penalty_player);
      } else {
        action_util.add_card_back_event(cards_num, "back", penalty_player);
      }
    }
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

    const position = game_class.find_position(penalty_player);

    const number_card = game_class.check_number_of_card(penalty_player);
    if (number_card >= 10) {
      game_class.show_back_card_again(penalty_player);
    } else {
      if (position === "left" || position === "right") {
        action_util.add_card_back_event(cards_num, "cardcol", penalty_player);
      } else {
        action_util.add_card_back_event(cards_num, "back", penalty_player);
      }
    }
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

    const position = game_class.find_position(penalty_player);

    const number_card = game_class.check_number_of_card(penalty_player);
    if (number_card >= 10) {
      game_class.show_back_card_again(penalty_player);
    } else {
      if (position === "left" || position === "right") {
        action_util.add_card_back_event(cards_num, "cardcol", penalty_player);
      } else {
        action_util.add_card_back_event(cards_num, "back", penalty_player);
      }
    }
    game_class.set_side_stuff();
  }

  game_class.set_current_player();
  game_class.set_deck();
  show_action_prompts(update);
});

/**
 * TODO final counting
 *
 *
 *
 *
 *
 */
