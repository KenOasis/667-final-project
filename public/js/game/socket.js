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
  const performer = update.actions[0].performer;
  const add_card = update.actions[0].card;
  const game_class = new game_state_helper(game_state);

  if (performer === player_controller.whoima()) {
    action_util
      .add_card_event(add_card)
      .then((result) => {
        if (result === "done") {
          const pass = document.getElementById("pass");
          pass.style.zIndex = 2;
          const desk = document.getElementById("draw");
          game_class.set_current_player();
          action_util.card_click_event(add_card);
          desk.disabled = true;
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
});

socket.on("gameUpdatePlayCard", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("PlayCard!");
  console.log(game_state);
  console.log(update);
});

socket.on("gameUpdateReverse", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Reverse!");
  console.log(game_state);
  console.log(update);
});

socket.on("gameUpdateSkip", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Skip!");
  console.log(game_state);
  console.log(update);
});
