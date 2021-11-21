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
  console.log("Draw card update!");
  console.log(game_state);
  console.log(update);
});
