const host = location.host;
const socket = io(host + "/game");

const game_id = JSON.parse(document.getElementById("user_list").value)[0]
  .game_id;

socket.on("gameUpdate", (data) => {
  const game_state = data.game_state;
  const update = data.update;
  console.log("Draw card update!");
  console.log(game_state);
  console.log(update);
});
