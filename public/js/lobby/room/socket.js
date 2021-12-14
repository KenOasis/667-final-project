const host = "http://" + location.host + "/room";
const socket = io(host, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
  upgrade: false,
});

socket.on("userListUpdate", (data) => {
  console.log("run");
  user_list = data.user_list;
  console.log(user_list);
  if (data.user_list.length === 4) {
    gameReady();
  }
});

socket.on("gameReady", (data) => {
  startGame(data.game_id);
});
