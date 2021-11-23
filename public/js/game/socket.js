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
  if (performer === player_controller.whoima()) {
    action_util
      .add_card_event(add_card)
      .then((result) => {
        if (result === "done") {
          console.log(game_state.undone_action);
          action_util.card_click_event(add_card);
          game_class.set_current_player(game_state.undone_action);
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
  const performer = update.actions[0].performer;
  console.log("performer", performer);

  console.log("Pass!");
  console.log(game_state);
  console.log(update);
  page_effect.cancel_highlinght();
  const action = game_state.undone_action;
  const game_class = new game_state_helper(game_state);
  if (game_class.check_current_is_receiver()) {
    game_class.set_card_click_event(true);
  } else {
    game_class.set_card_click_event(false);
  }
  game_class.set_current_player(action);
});
