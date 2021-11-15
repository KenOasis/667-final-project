const host = location.host;
const socket = io(host + "/loading");

// test code for socket handshake.
socket.on('userJoinLoading', (data) => {
  const user_list = data.user_list;
  userJoin(user_list);
});