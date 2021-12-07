const host = "http://" + location.host + "/lobby";
const socket = io(host, {
  reconnectionDelayMax: 10000,
  transports: ["websocket"],
  upgrade: false,
});

// socket event listener
socket.on("userListInitial", (data) => {
  const userList = data.user_list;
  initialUserList(userList);
  // }
});

socket.on("userJoinLobby", (data) => {
  if (data.username !== whoami) {
    let currentUser = document.getElementById(`user-${data.username}`);
    const user = {
      username: data.username,
      status: data.status,
    };
    const newUser = constructUserElement(user);
    if (currentUser === null) {
      userListContainer.appendChild(newUser);
    } else {
      userListContainer.insertBefore(newUser, currentUser);
      userListContainer.removeChild(currentUser);
    }
  }
});

socket.on("userLeaveLobby", (data) => {
  if (data.username !== whoami) {
    let currentUser = document.getElementById(`user-${data.username}`);
    if (currentUser !== null) {
      userListContainer.removeChild(currentUser);
    }
  }
});

socket.on("updateUserStatus", (data) => {
  let currentUser = document.getElementById(`user-${data.username}`);
  if (currentUser !== null) {
    const newUser = constructUserElement(data);
    userListContainer.insertBefore(newUser, currentUser);
    userListContainer.removeChild(currentUser);
  }
});

socket.on("chat", (data) => {
  updateChat(data);
});

socket.on("gameListInitial", (data) => {
  initialGameList(data);
});

socket.on("updateGameList", (data) => {
  if (data.game_list) {
    initialGameList(data.game_list);
  }
});

socket.on("initGame", (data) => {
  const new_game = data.game;
  const new_game_li = constructGameElement(new_game);
  const current_game_li = document.getElementById(`game-${data.game.game_id}`);
  gameListContainer.insertBefore(new_game_li, current_game_li);
  gameListContainer.removeChild(current_game_li);
});

socket.on("gameReady", (data) => {
  if (toastContainer) {
    const newToast = addToast(data.message);
    let toast = new bootstrap.Toast(newToast);
    toast.show();
  }
  setTimeout(function () {
    startGame(data.game_id);
  }, 1000);
  // startGame(data.game_id);
});

// test code for socket handshake.
// socket.on('Hello', (data) => {
//   // if (lobbyToast) {
//   //   lobbyMessage.innerHTML = "Hello!" + data;
//   //   let toast = new bootstrap.Toast(lobbyToast);
//   //   toast.show();
//   // }
// });
