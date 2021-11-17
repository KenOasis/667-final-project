const host = location.host;
const socket = io(host + "/game");

// test code for socket handshake.
socket.on("userJoin", (data) => {
  const user_list = data.user_list;
  const username = data.username;
  console.log(`${username} join the game!`);
  console.log(user_list);
});

socket.on("gameStart", (data) => {
  // load initial game state
  console.log("All join, game is start loading state");
});
