const host = location.host;
const socket = io(host + "/game");

// test code for socket handshake.
socket.on("userJoin", (data) => {
  const username = data.username;
});

socket.on("userList", (data) => {
  console.log(data.user_list);
});
