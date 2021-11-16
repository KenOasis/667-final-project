const host = location.host;
const socket = io(host);

// socket event listener
socket.on('userListInitial', (data) => {
  const userList = data.user_list;
  initialUserList(userList);
// }
});

socket.on('userJoinLobby', data => {
if (toastContainer) {
  const newToast = addToast(data.username + " has joined the lobby!");
  let toast = new bootstrap.Toast(newToast);
  toast.show(); 
}
if (data.username !== whoami) {
  const queryPattern = `[id^="user-${data.username}"]`;
  let currentUser = document.querySelector(queryPattern);
  const user = {
    username: data.username,
    status: data.status,
    id: data.id
  }
  const newUser = constructUserElement(user);
  if(currentUser === null) {
    userListContainer.appendChild(newUser)
  } else {
    userListContainer.insertBefore(newUser, currentUser);
    userListContainer.removeChild(currentUser);
  }
}
});

socket.on('userLeaveLobby', data => {
if (toastContainer) {
  const newToast = addToast(data.user.username + " has left the lobby!");
  let toast = new bootstrap.Toast(newToast);  
  toast.show(); 
}
if (data.user.username !== whoami) {
  const queryPattern = `[id^="user-${data.user.username}"]`;
  let currentUser = document.querySelector(queryPattern);
  if (currentUser !== null) {
    userListContainer.removeChild(currentUser);
  }
  initialGameList(data.gameList);
}
});


socket.on('updateUserStatus', user => {
const queryPattern = `[id^="user-${user.username}"]`;
let currentUser = document.querySelector(queryPattern);
if (currentUser !== null) {
  const newUser = constructUserElement(user);
  userListContainer.insertBefore(newUser, currentUser);
  userListContainer.removeChild(currentUser);
}
});

socket.on('lobbyChat', (data) => {
  updateChat(data);
});

socket.on('gameListInitial', (data) => {
  initialGameList(data);
});

socket.on('createGame', new_game => {
const gameElement = document.getElementById('game-' + new_game.game_id);
if (gameElement === null) {
  const newGameElement = constructGameElement(new_game);
  gameListContainer.appendChild(newGameElement);
  if (toastContainer) {
    const newToast = addToast("Game " + new_game.name + " is created.");
    let toast = new bootstrap.Toast(newToast);
    toast.show(); 
  }
}
})

socket.on('joinGame', data => {
  if (data.game !== null) {
    const new_game = data.game;
    const new_game_li = constructGameElement(new_game);
    const current_game_li = document.getElementById(`game-${data.game.game_id}`);
    gameListContainer.insertBefore(new_game_li, current_game_li);
    gameListContainer.removeChild(current_game_li);
  }
})

socket.on('leaveGame', data => {
  if (data.game_status === "existed" ) {
    const new_game = data.game;
    const new_game_li = constructGameElement(new_game);
    const current_game_li = document.getElementById(`game-${data.game.game_id}`);
    gameListContainer.insertBefore(new_game_li, current_game_li);
    gameListContainer.removeChild(current_game_li);
  } else {
    // game has no player, remove from the list
    const game_li = document.getElementById(`game-${data.game.game_id}`);
    gameListContainer.removeChild(game_li);
  }
});


socket.on('initGame', data => {
  const new_game = data.game;
  const new_game_li = constructGameElement(new_game);
  const current_game_li = document.getElementById(`game-${data.game.game_id}`);
  gameListContainer.insertBefore(new_game_li, current_game_li);
  gameListContainer.removeChild(current_game_li);

});

socket.on("gameReady", data => {
  if (toastContainer) {
    const newToast = addToast(data.message);
    let toast = new bootstrap.Toast(newToast);
    toast.show(); 
  }
})

// test code for socket handshake.
// socket.on('Hello', (data) => {
//   // if (lobbyToast) {
//   //   lobbyMessage.innerHTML = "Hello!" + data;
//   //   let toast = new bootstrap.Toast(lobbyToast);
//   //   toast.show(); 
//   // }
// });
