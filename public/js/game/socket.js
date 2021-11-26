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
});

socket.on("gameUpdateWild", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Wild!");
  console.log(game_state);
  console.log(update);
});

socket.on("gameUpdateWildDrawFour", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Wild Draw Four!");
  console.log(game_state);
  console.log(update);
});
