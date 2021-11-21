const host = "http://" + location.host + "/game";
const socket = io(host, {
  reconnectionDelayMax: 10000,
});

const game_id = JSON.parse(document.getElementById("user_list").value)[0]
  .game_id;

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

socket.on("gameUpdate", (data) => {
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
